import { setup, teardown, env } from '../env'

const adminEmail = 'signinadmin@jest.test'
const adminPassword =
  'sd65h46s4a65d4gh654dfh6a54df6h54as6d5f4h6sa54fh6adfs6h54'
const { SECRET, userApi, jwt } = env

beforeAll(async () => {
  await setup(adminEmail, adminPassword)
})

afterAll(async () => {
  await teardown()
})

describe('signIn', () => {
  let response

  it('returns a valid token', async () => {
    response = await userApi
      .signIn({
        email: adminEmail,
        password: adminPassword,
      })
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )
    const token = response.data.data.signIn.token
    const validated = await jwt.verify(token, SECRET)
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

  it('does not set cookie or return a token if sign in failed', async () => {
    const failedResponse = await userApi
      .signIn({
        email: 'invalidUser@jest.test',
        password: 'invalidPassword',
      })
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )
    const failedToken = failedResponse?.data?.data?.signIn?.token
    const failedSessionIdCookie =
      failedResponse?.headers['set-cookie']
    expect(failedToken).toBeUndefined()
    expect(failedSessionIdCookie).toBeUndefined()
  })
})
