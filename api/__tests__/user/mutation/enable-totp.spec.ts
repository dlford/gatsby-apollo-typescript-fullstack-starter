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

describe('setupTotp', () => {
  let user
  let recoveryCodes
  it('enables TOTP on user document in database', async () => {
    const initialSignInResponse = await userApi
      .signIn({
        email: adminEmail,
        password: adminPassword,
      })
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    const token = initialSignInResponse.data.data.signIn.token
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

    const enableTotpResult = await userApi
      .enableTotp(
        {
          token: totpToken,
        },
        token,
      )
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    user = await models.User.findOne({ email: adminEmail })
    recoveryCodes =
      enableTotpResult.data.data.enableTotp.recoveryCodes

    expect(enableTotpResult.data.errors).toBeUndefined()
    expect(user.totpEnabled).toBeTruthy()
  })

  it('returns ten recovery codes in base32 format', () => {
    expect(recoveryCodes.length).toBe(10)
    expect(recoveryCodes.toString()).toMatch(/[A-Z0-9]+,+/)
  })

  it('saves recovery codes to user document in database', async () => {
    expect(user.recoveryCodes.toString()).toBe(
      recoveryCodes.toString(),
    )
  })
})
