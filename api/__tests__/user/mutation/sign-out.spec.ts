import { setup, teardown, env } from '../env'

const adminEmail = 'signoutadmin@jest.test'
const adminPassword =
  's654h6s5f4j6d5g4j654a6sd4g6s5d4hf6s4h6s5d4fh65sd4h654h'
const { models, userApi } = env

beforeAll(async () => {
  await setup(adminEmail, adminPassword)
})

afterAll(async () => {
  await teardown()
})

describe('signOut', () => {
  let response
  it('removes session from database', async () => {
    const signInResponse = await userApi
      .signIn({
        email: adminEmail,
        password: adminPassword,
      })
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    const token = signInResponse.data.data.signIn.token
    const cookies: string = signInResponse.headers['set-cookie']
      .map((cookie) => cookie.replace(/; .*/, ''))
      .join('; ')

    const sessionId = /sessionId=([^;]+)/.exec(cookies)[1]

    expect(await models.Session.findById(sessionId)).toBeDefined()

    response = await userApi
      .signOut(token, cookies, {})
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    expect(response.data.errors).toBeUndefined()
    expect(await models.Session.findById(sessionId)).toBe(null)
  })
  it('clears session ID cookie', () => {
    const sessionIdCookie = response.headers[
      'set-cookie'
    ].find((cookie) => /^sessionId/.test(cookie))
    expect(sessionIdCookie).toMatch(/Max-Age=0;/)
  })
  it('clears session token cookie', () => {
    const sessionTokenCookie = response.headers[
      'set-cookie'
    ].find((cookie) => /^sessionToken/.test(cookie))
    expect(sessionTokenCookie).toMatch(/Max-Age=0;/)
  })
  it('clears all sessions from DB when signing out all devices', async () => {
    const email = 'testsignoutall@jest.test'
    const password =
      's4g65d4fgser4gs84g6s4g68s4r6gs846dr8g46as84g6as4dg854d654'

    await userApi
      .signUp({
        email: email,
        password: password,
      })
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    await userApi
      .signIn({
        email: email,
        password: password,
      })
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    const signInResponse = await userApi
      .signIn({
        email: email,
        password: password,
      })
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    const token = signInResponse.data.data.signIn.token
    const cookies: string = signInResponse.headers['set-cookie']
      .map((cookie) => cookie.replace(/; .*/, ''))
      .join('; ')

    const user = await models.User.findOne({ email })

    const multiSessions = await models.Session.find({
      userId: user.id,
    }).countDocuments()

    await userApi
      .signOut(token, cookies, { allDevices: true })
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )

    const removedSessions = await models.Session.find({
      userId: user.id,
    }).countDocuments()

    await user.remove()

    expect(multiSessions).toBe(3)
    expect(removedSessions).toBe(0)
  })
})
