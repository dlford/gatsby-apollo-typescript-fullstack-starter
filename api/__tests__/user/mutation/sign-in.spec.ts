import { setup, teardown, env } from '../env'

const { SECRET, TEST_ADMIN, TEST_ADMIN_PASSWORD, userApi, jwt } = env

beforeAll(async () => {
  await setup()
})

afterAll(async () => {
  await teardown()
})

describe('User', () => {
  describe('Mutation', () => {
    describe('signIn', () => {
      let response
      it('returns a valid token', async () => {
        response = await userApi
          .signIn({
            email: TEST_ADMIN,
            password: TEST_ADMIN_PASSWORD,
          })
          .catch((err) =>
            console.error(
              err?.response?.data || err?.response || err,
            ),
          )
        const token = response.data.data.signIn.token
        const validated = await jwt.verify(token, SECRET)
        expect(validated.email).toBe(TEST_ADMIN)
        expect(validated.role).toBe('ADMIN')
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
    })
  })
})
