import * as speakeasy from 'speakeasy'

import { setup, teardown, env } from '../env'
import models from '../../../src/models'

const adminEmail = 'signinadmin@jest.test'
const adminPassword =
  'sd65h46s4a65d4gh654dfh6a54df6h54as6d5f4h6sa54fh6adfs6h54'
const { secret, userApi, jwt } = env

beforeAll(async () => {
  await setup(adminEmail, adminPassword)
})

afterAll(async () => {
  await teardown()
})

describe('signIn', () => {
  let response
  let totpSignInToken
  let user

  it('returns a valid token', async () => {
    user = await models.User.findOne({ email: adminEmail })
    response = await userApi
      .signIn({
        email: adminEmail,
        password: adminPassword,
      })
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )
    const token = response.data.data.signIn.token
    const validated = await jwt.verify(token, secret)
    expect(validated.email).toBe(adminEmail)
    expect(validated.role).toBe('ADMIN')
    expect(validated.id).toBe(user.id)
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

  it('does not set cookies when TOTP authorization step is required', async () => {
    const token = response.data.data.signIn.token
    const setupTotpResult = await userApi.setupTotp(token)
    const base32 = setupTotpResult.data.data.setupTotp.base32
    const totpToken = speakeasy.totp({
      secret: base32,
      encoding: 'base32',
    })
    await userApi
      .enableTotp({ token: totpToken }, token)
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    const signInResponse = await userApi
      .signIn({
        email: adminEmail,
        password: adminPassword,
      })
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    totpSignInToken = signInResponse?.data?.data?.signIn?.token

    const totpSessionIdCookie = signInResponse?.headers['set-cookie']

    expect(totpSessionIdCookie).toBeUndefined()
  })

  it('returns a valid totpSignInToken if TOTP is enabled', async () => {
    const { userId, email, role } = await jwt.verify(
      totpSignInToken,
      secret,
    )

    expect(userId).toBe(user.id)
    expect(email).toBeUndefined()
    expect(role).toBeUndefined()
  })

  it('does not set cookie or return a token if sign in failed', async () => {
    const failedResponse = await userApi
      .signIn({
        email: 'invalidUser@jest.test',
        password: 'invalidPassword',
      })
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )
    const failedToken = failedResponse?.data?.data?.signIn?.token
    const failedSessionIdCookie =
      failedResponse?.headers['set-cookie']
    const errorMessage = failedResponse.data.errors[0].message

    expect(errorMessage).toBe('Email address or password incorrect')
    expect(failedToken).toBeUndefined()
    expect(failedSessionIdCookie).toBeUndefined()
  })
})
