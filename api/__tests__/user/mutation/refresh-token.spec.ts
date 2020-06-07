import { setup, teardown, env } from '../env'

const adminEmail = 'refreshtokenadmin@jest.test'
const adminPassword =
  '65jk46d54hs6d5f4h6s54hg6s54h65s4h65df4h6s5d4fh6s5d4f'
const { SECRET, userApi, jwt } = env

beforeAll(async () => {
  await setup(adminEmail, adminPassword)
})

afterAll(async () => {
  await teardown()
})

describe('refreshToken', () => {
  let response
  it('returns null when cookies are not set', async () => {
    const response = await userApi
      .refreshToken()
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    const result = response.data.data.refreshToken
    expect(response.data.errors).toBeUndefined()
    expect(result).toBe(null)
  })
  it('returns a valid token when cookies are set', async () => {
    const signInResponse = await userApi
      .signIn({
        email: adminEmail,
        password: adminPassword,
      })
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )
    const cookies: string = signInResponse.headers['set-cookie']
      .map((cookie) => cookie.replace(/; .*/, ''))
      .join('; ')

    response = await userApi
      .refreshToken(cookies)
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    const token = response.data.data.refreshToken
    const validated = await jwt.verify(token, SECRET)
    expect(response.data.errors).toBeUndefined()
    expect(validated.email).toBe(adminEmail)
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
