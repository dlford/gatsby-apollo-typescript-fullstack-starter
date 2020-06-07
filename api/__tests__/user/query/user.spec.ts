import { setup, teardown, env } from '../env'

let adminToken
const { SECRET, models, userApi, jwt } = env

beforeAll(async () => {
  adminToken = await setup()
})

afterAll(async () => {
  await teardown()
})

describe('User', () => {
  describe('Query', () => {
    describe('user', () => {
      const email = 'testuser@jest.test'
      let userToList
      let queryResult

      it('rejects non-admin usage', async () => {
        userToList = await models.User.create({
          email: email,
          password: 's564gh6sa54rh6a54r6ga4654ga54g6a54s654g',
        }).catch(
          async () => await models.User.findOneAndDelete({ email }),
        )
        const { id, email: userEmail, role } = userToList
        const userToken = await jwt.sign(
          { id, email: userEmail, role },
          SECRET,
          {
            expiresIn: '30m',
          },
        )
        const response = await userApi
          .user({ id: userToList.id }, userToken)
          .catch((err) =>
            console.error(
              err?.response?.data || err?.response || err,
            ),
          )
        const result = response.data.data.user
        const code = response.data.errors.filter(
          (error) => !!error?.extensions?.code,
        )[0].extensions.code

        expect(result).toBe(null)
        expect(code).toBe('FORBIDDEN')
      })

      it('allows admin usage', async () => {
        const response = await userApi
          .user({ id: userToList.id }, adminToken)
          .catch((err) =>
            console.error(
              err?.response?.data || err?.response || err,
            ),
          )
        queryResult = response.data.data.user
        expect(response.data.errors).toBeUndefined()
      })

      it('returns a valid user', async () => {
        await models.User.findOneAndDelete({
          email: userToList.email,
        })
        expect(queryResult.email).toBe(email)
        expect(queryResult.role).toBe('USER')
        expect(queryResult.id).toBeDefined()
      })
    })
  })
})
