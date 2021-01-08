import models from '../../../src/models'

import { setup, teardown, env } from '../env'

const adminEmail = 'setupTotpAdmin@jest.test'
const adminPassword = '34khu5j3h45jk2k352krh2kj4h5k3jh5k6k3jh6k3j4h'
const { userApi } = env

beforeAll(async () => {
  await setup(adminEmail, adminPassword)
})

afterAll(async () => {
  await teardown()
})

describe('setupTotp', () => {
  let user
  let base32Secret
  it('returns a generated base32 secret and qr image tag', async () => {
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

    base32Secret = setupTotpResult.data.data.setupTotp.base32
    const qr = setupTotpResult.data.data.setupTotp.qr

    user = await models.User.findOne({ email: adminEmail })

    expect(setupTotpResult.data.errors).toBeUndefined()
    expect(base32Secret).toMatch(/[A-Z0-9]+/)
    expect(qr).toMatch(/data:image\/png;base64,.*/)
  })

  it('stores base32 secret on user document in database', () => {
    expect(user.base32Secret).toBe(base32Secret)
  })

  it('does not enable TOTP for user', () => {
    expect(user.totpEnabled).toBeFalsy()
  })
})
