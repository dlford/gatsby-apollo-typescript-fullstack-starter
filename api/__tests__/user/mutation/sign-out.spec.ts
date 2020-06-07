import { setup, teardown, env } from '../env'

const { TEST_ADMIN, TEST_ADMIN_PASSWORD, models, userApi } = env

beforeAll(async () => {
  await setup()
})

afterAll(async () => {
  await teardown()
})

describe('User', () => {
  describe('Mutation', () => {
    describe('signOut', () => {
      let response
      it('removes session from database', async () => {
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

        const token = signInResponse.data.data.signIn.token
        const cookies: string = signInResponse.headers['set-cookie']
          .map((cookie) => cookie.replace(/; .*/, ''))
          .join('; ')

        const sessionId = /sessionId=([^;]+)/.exec(cookies)[1]

        expect(await models.Session.findById(sessionId)).toBeDefined()

        response = await userApi
          .signOut(token, cookies, {})
          .catch((err) =>
            console.error(
              err?.response?.data || err?.response || err,
            ),
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
            console.error(
              err?.response?.data || err?.response || err,
            ),
          )

        await userApi
          .signIn({
            email: email,
            password: password,
          })
          .catch((err) =>
            console.error(
              err?.response?.data || err?.response || err,
            ),
          )

        const signInResponse = await userApi
          .signIn({
            email: email,
            password: password,
          })
          .catch((err) =>
            console.error(
              err?.response?.data || err?.response || err,
            ),
          )

        const token = signInResponse.data.data.signIn.token
        const cookies: string = signInResponse.headers['set-cookie']
          .map((cookie) => cookie.replace(/; .*/, ''))
          .join('; ')

        const user = await models.User.findOne({ email })

        const multiSessions = await models.Session.find({
          userId: user.id,
        }).count()
        console.log(user.id)
        console.log(multiSessions)

        await userApi
          .signOut(token, cookies, { allDevices: true })
          .catch((err) =>
            console.error(
              err?.response?.data || err?.response || err,
            ),
          )

        const removedSessions = await models.Session.find({
          userId: user.id,
        }).count()

        await user.remove()

        expect(multiSessions).toBe(3)
        expect(removedSessions).toBe(0)
      })
    })
  })
})
