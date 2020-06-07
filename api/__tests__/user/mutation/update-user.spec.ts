import { setup, teardown, env } from '../env'

let adminToken
const { TEST_ADMIN, models, userApi } = env

beforeAll(async () => {
  adminToken = await setup()
})

afterAll(async () => {
  await teardown()
})

describe('User', () => {
  describe('Mutation', () => {
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
            console.error(
              err?.response?.data || err?.response || err,
            ),
          )
        const user = response.data.data.updateUser

        // Put it back for later tests
        await models.User.findOneAndUpdate(
          { email: email },
          { email: TEST_ADMIN },
        )
        expect(user.email).toBe(email)
        expect(user.role).toBe('ADMIN')
        expect(user.id).toBeDefined()
      })
    })
  })
})
