import { setup, teardown, env } from '../env'

const { SECRET, models, userApi, jwt } = env

beforeAll(async () => {
  await setup()
})

afterAll(async () => {
  await teardown()
})

describe('User', () => {
  describe('Query', () => {
    describe('me', () => {
      it('returns an empty object when no token is provided', async () => {
        const response = await userApi
          .me()
          .catch((err) =>
            console.error(
              err?.response?.data || err?.response || err,
            ),
          )
        const result = response.data.data.me
        expect(result).toBe(null)
        expect(response.data.errors).toBeUndefined()
      })

      it('returns a user for a given token', async () => {
        const email = 'testme@jest.test'
        const userToTestMe = await models.User.create({
          email,
          password: 'a6sdfg46sdf54g6sd5h46s5d4hg6a5d4f',
        })
        const { id, email: meEmail, role } = userToTestMe
        const meToken = await jwt.sign(
          { id, email: meEmail, role },
          SECRET,
          {
            expiresIn: '30m',
          },
        )
        const response = await userApi
          .me(meToken)
          .catch((err) =>
            console.error(
              err?.response?.data || err?.response || err,
            ),
          )
        await userToTestMe.remove()
        const result = response.data.data.me
        expect(result.email).toBe(email)
        expect(result.role).toBe('USER')
        expect(result.id).toBeDefined()
      })
    })
  })
})
