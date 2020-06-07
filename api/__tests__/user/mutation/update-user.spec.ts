import { setup, teardown, env } from '../env'

let adminToken
const adminEmail = 'updateuseradmin@jest.test'
const adminPassword =
  'srs6d5fh46s4h6sd54ht564hs64fh6s54h6s46fh5g4sa6df5h46sd5f4h65df4'
const { models, userApi } = env

beforeAll(async () => {
  adminToken = await setup(adminEmail, adminPassword)
})

afterAll(async () => {
  await teardown()
})

describe('updateUser', () => {
  const email = 'testupdate@jest.test'

  it('updates user email address', async () => {
    const response = await userApi
      .updateUser(
        {
          email: email,
        },
        adminToken,
      )
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )
    const user = response.data.data.updateUser

    // Put it back for later tests
    await models.User.findOneAndUpdate(
      { email: email },
      { email: adminEmail },
    )
    expect(user.email).toBe(email)
    expect(user.role).toBe('ADMIN')
    expect(user.id).toBeDefined()
  })
})
