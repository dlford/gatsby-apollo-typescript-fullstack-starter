import * as speakeasy from 'speakeasy'

import models from '../../../src/models'
import { setup, teardown, env } from '../env'

const adminEmail = 'enableTotpAdmin@jest.test'
const adminPassword = '3i4ui34utn5i43utn3n53kiu43urfoi3o3u4fnio3n4u'
const { userApi } = env

beforeAll(async () => {
  await setup(adminEmail, adminPassword)
})

afterAll(async () => {
  await teardown()
})

describe('disableTotp', () => {
  let token: string
  it('disables TOTP on user document in database', async () => {
    const initialSignInResponse = await userApi
      .signIn({
        email: adminEmail,
        password: adminPassword,
      })
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    token = initialSignInResponse.data.data.signIn.token
    const setupTotpResult = await userApi
      .setupTotp(token)
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )
    const base32Secret = setupTotpResult.data.data.setupTotp.base32

    const totpToken = speakeasy.totp({
      secret: base32Secret,
      encoding: 'base32',
    })

    await userApi
      .enableTotp(
        {
          token: totpToken,
        },
        token,
      )
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    let user = await models.User.findOne({ email: adminEmail })
    expect(user.totpEnabled).toBeTruthy()

    const disableTotpResult = await userApi
      .disableTotp(
        {
          password: adminPassword,
        },
        token,
      )
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    user = await models.User.findOne({ email: adminEmail })

    expect(disableTotpResult.data.errors).toBeUndefined()
    expect(user.totpEnabled).toBeFalsy()
  })

  it('requires a valid password to disable', async () => {
    const disableTotpResult = await userApi
      .disableTotp(
        {
          password: 'invalid',
        },
        token,
      )
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    expect(disableTotpResult.data.errors[0].message).toBe(
      'Password incorrect',
    )
  })
})
