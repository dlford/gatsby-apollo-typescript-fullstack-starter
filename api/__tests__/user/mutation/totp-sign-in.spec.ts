import * as speakeasy from 'speakeasy'
import models from '../../../src/models'

import { setup, teardown, env } from '../env'

const adminEmail = 'totpSignInAdmin@jest.test'
const adminPassword =
  '9348fj3829jf02jf29k3f029kfe02k0239f092kf029kf092kf02k'
const { secret, userApi, jwt } = env

beforeAll(async () => {
  await setup(adminEmail, adminPassword)
})

afterAll(async () => {
  await teardown()
})

describe('totpSignIn', () => {
  let response
  let user
  let usedRecoveryCode

  it('correctly validates TOTP returns a valid access token', async () => {
    const initialSignInResponse = await userApi
      .signIn({
        email: adminEmail,
        password: adminPassword,
      })
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    const token = initialSignInResponse.data.data.signIn.token
    const setupTotpResult = await userApi.setupTotp(token)
    const base32 = setupTotpResult.data.data.setupTotp.base32
    const totpSetupToken = speakeasy.totp({
      secret: base32,
      encoding: 'base32',
    })

    await userApi
      .enableTotp({ token: totpSetupToken }, token)
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    // Wait to assign user until TOTP is enabled
    // so it includes recoveryCodes
    user = await models.User.findOne({ email: adminEmail })

    const signInResponse = await userApi
      .signIn({
        email: adminEmail,
        password: adminPassword,
      })
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    const totpSignInToken = signInResponse?.data?.data?.signIn?.token

    const totpToken = speakeasy.totp({
      secret: base32,
      encoding: 'base32',
    })

    response = await userApi
      .totpSignIn({ totpSignInToken, token: totpToken })
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    const accessToken = response.data.data.totpSignIn.token

    const validated = await jwt.verify(accessToken, secret)
    expect(validated.email).toBe(adminEmail)
    expect(validated.role).toBe('ADMIN')
    expect(validated.id).toBe(user.id)
  })

  it('allows the use of a recovery code', async () => {
    const signInResponse = await userApi
      .signIn({
        email: adminEmail,
        password: adminPassword,
      })
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    const totpSignInToken = signInResponse?.data?.data?.signIn?.token

    usedRecoveryCode = user.recoveryCodes[0]

    response = await userApi
      .totpSignIn({ totpSignInToken, recoveryCode: usedRecoveryCode })
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    const accessToken = response.data.data.totpSignIn.token

    const validated = await jwt.verify(accessToken, secret)
    expect(validated.email).toBe(adminEmail)
    expect(validated.role).toBe('ADMIN')
    expect(validated.id).toBe(user.id)
  })

  it('burns recovery code after use', async () => {
    const user = await models.User.findOne({ email: adminEmail })
    expect(user.recoveryCodes.includes(usedRecoveryCode)).toBe(false)
  })

  it('sets a sessionId cookie', async () => {
    const sessionIdCookie = response.headers[
      'set-cookie'
    ].find((cookie) => /^sessionId/.test(cookie))
    expect(sessionIdCookie).toMatch(/Max-Age=2592000/)
    expect(sessionIdCookie).toMatch(/HttpOnly/)
    expect(sessionIdCookie).toMatch(/SameSite=Strict/)
  })

  it('sets a sessionToken cookie', async () => {
    const sessionTokenCookie = response.headers[
      'set-cookie'
    ].find((cookie) => /^sessionToken/.test(cookie))
    expect(sessionTokenCookie).toMatch(/Max-Age=2592000/)
    expect(sessionTokenCookie).toMatch(/HttpOnly/)
    expect(sessionTokenCookie).toMatch(/SameSite=Strict/)
  })

  it('does not set cookie or return a token if TOTP is invalid', async () => {
    const signInResponse = await userApi
      .signIn({
        email: adminEmail,
        password: adminPassword,
      })
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    const totpSignInToken = signInResponse?.data?.data?.signIn?.token

    const failedResponse = await userApi
      .totpSignIn({
        totpSignInToken,
        token: 'invalid',
      })
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    const failedToken = failedResponse?.data?.data?.signIn?.token
    const failedSessionIdCookie =
      failedResponse?.headers['set-cookie']
    const errorMessage = failedResponse.data.errors[0].message

    expect(errorMessage).toBe('Invalid TOTP token')
    expect(failedToken).toBeUndefined()
    expect(failedSessionIdCookie).toBeUndefined()
  })
})
