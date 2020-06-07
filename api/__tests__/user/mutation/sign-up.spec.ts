import { setup, teardown, env } from '../env'

const { SECRET, models, userApi, jwt } = env

beforeAll(async () => {
  await setup()
})

afterAll(async () => {
  await teardown()
})

describe('User', () => {
  describe('Mutation', () => {
    describe('signUp', () => {
      const email = 'testcreate@jest.test'
      let response

      it('returns a valid token', async () => {
        response = await userApi
          .signUp({
            email: email,
            password:
              '65h45d4fh6d54g6s54gd64hg4h6gs4gs54dg6s4g646s6gd54s4',
          })
          .catch((err) =>
            console.error(
              err?.response?.data || err?.response || err,
            ),
          )
        const token = response.data.data.signUp.token
        const validated = await jwt.verify(token, SECRET)
        expect(validated.email).toBe(email)
        expect(validated.role).toBe('USER')
        expect(validated.id).toBeDefined()
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
      it('creates a user in DB', async () => {
        const user = await models.User.findOne({
          email: email,
        })
        expect(user.id).toBeDefined()
        expect(user.email).toBe(email)
        expect(user.role).toBe('USER')
        await user.remove()
      })
    })
  })
})
