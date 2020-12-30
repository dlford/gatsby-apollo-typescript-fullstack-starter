import { setup, teardown, env } from '../env'

const adminEmail = 'refreshtokenadmin@jest.test'
const adminPassword =
  '65jk46d54hs6d5f4h6s54hg6s54h65s4h65df4h6s5d4fh6s5d4f'
const { secret, userApi, jwt, models } = env

beforeAll(async () => {
  await setup(adminEmail, adminPassword)
})

afterAll(async () => {
  await teardown()
})

describe('refreshToken', () => {
  it('returns error when cookies are not set', async () => {
    const response = await userApi
      .refreshToken()
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    expect(response.data.errors[0]).toEqual(
      expect.objectContaining({
        message: 'Your session has expired',
      }),
    )
    expect(response.data.data).toBe(null)
  })

  it('clears cookies on invalid requests', async () => {
    const response = await userApi
      .refreshToken()
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    const sessionIdCookie = response.headers[
      'set-cookie'
    ].find((cookie) => /^sessionId/.test(cookie))

    const sessionTokenCookie = response.headers[
      'set-cookie'
    ].find((cookie) => /^sessionToken/.test(cookie))

    expect(sessionIdCookie).toMatch(/Max-Age=0/)
    expect(sessionTokenCookie).toMatch(/Max-Age=0/)
  })

  it('clears cookies when refreshToken is invalid', async () => {
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
      .replace(/sessionToken.*/, 'sessionToken=INVALID_TOKEN')

    const response = await userApi
      .refreshToken(cookies)
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    const sessionIdCookie = response.headers[
      'set-cookie'
    ].find((cookie) => /^sessionId/.test(cookie))

    const sessionTokenCookie = response.headers[
      'set-cookie'
    ].find((cookie) => /^sessionToken/.test(cookie))

    const sessionId = cookies
      .replace(/.*sessionId=/, '')
      .replace(/;.*/, '')

    const findSession = await models.Session.find({ id: sessionId })

    expect(findSession.length).toBe(0)
    expect(sessionIdCookie).toMatch(/Max-Age=0/)
    expect(sessionTokenCookie).toMatch(/Max-Age=0/)
  })

  it('removes session when refreshToken is invalid', async () => {
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
      .replace(/sessionToken.*/, 'sessionToken=INVALID_TOKEN')

    const sessionId = cookies
      .replace(/.*sessionId=/, '')
      .replace(/;.*/, '')

    let findSession = await models.Session.findById(sessionId)

    expect(findSession).toBeDefined()

    await userApi
      .refreshToken(cookies)
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    findSession = await models.Session.findById(sessionId)

    expect(findSession).toBeNull()
  })

  let response
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
    const validated = await jwt.verify(token, secret)
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
