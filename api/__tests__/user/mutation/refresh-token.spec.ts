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
    describe('refreshToken', () => {
      let response
      it('returns null when cookies are not set', async () => {
        const response = await userApi
          .refreshToken()
          .catch((err) =>
            console.error(
              err?.response?.data || err?.response || err,
            ),
          )

        const result = response.data.data.refreshToken
        expect(response.data.errors).toBeUndefined()
        expect(result).toBe(null)
      })
      it('returns a valid token when cookies are set', async () => {
        const signInResponse = await userApi
          .signIn({
            email: TEST_ADMIN,
            password: TEST_ADMIN_PASSWORD,
          })
          .catch((err) =>
            console.error(
              err?.response?.data || err?.response || err,
            ),
          )
        const cookies: string = signInResponse.headers['set-cookie']
          .map((cookie) => cookie.replace(/; .*/, ''))
          .join('; ')

        response = await userApi
          .refreshToken(cookies)
          .catch((err) =>
            console.error(
              err?.response?.data || err?.response || err,
            ),
          )

        const token = response.data.data.refreshToken
        const validated = await jwt.verify(token, SECRET)
        expect(response.data.errors).toBeUndefined()
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
