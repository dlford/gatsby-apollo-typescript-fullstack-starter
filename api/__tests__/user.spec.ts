import models, { connectDb } from '../src/models'
import * as userApi from './api/user'
import * as jwt from 'jsonwebtoken'

/* TODO
 * - test deleted session on delete user
 * - test no cookies when sign in fails
 * - test sign out all devices
 * - test clear cookies when refreshToken fails
 * - test session deleted if refreshToken invalid
 */

let db
let adminToken
const SECRET = process.env.SECRET || 'secret-stub'
const TEST_ADMIN = 'admin@jest.test'
const TEST_ADMIN_PASSWORD =
  '394nv9349cr2m02mc028y3c9eytn7ioc348cur984yrcn93ceoo'

beforeAll(async () => {
  db = await connectDb()

  await models.User.create({
    email: TEST_ADMIN,
    password: TEST_ADMIN_PASSWORD,
    role: 'ADMIN',
  })

  const { id, email, role } = await models.User.findOne({
    email: TEST_ADMIN,
  })

  adminToken = await jwt.sign({ id, email, role }, SECRET, {
    expiresIn: '30m',
  })
})

afterAll(async () => {
  await Promise.all([
    models.User.deleteOne({ email: TEST_ADMIN }),
    models.User.deleteOne({ email: 'user@jest.test' }),
  ])
  await db.connection.close()
})

describe('users', () => {
  describe('Query: users', () => {
    const email = 'testusers@jest.test'
    let userToListUsers
    let queryResult

    it('rejects non-admin usage', async () => {
      userToListUsers = await models.User.create({
        email: email,
        password: '6df54g6d54g6hs6gfj46df4h6sd5f4g6ds54h6546f54h',
      }).catch(
        async () => await models.User.findOneAndDelete({ email }),
      )
      const { id, email: userEmail, role } = userToListUsers
      const usersToken = await jwt.sign(
        { id, email: userEmail, role },
        SECRET,
        {
          expiresIn: '30m',
        },
      )
      const response = await userApi
        .users(usersToken)
        .catch((err) =>
          console.error(err?.response?.data || err?.response || err),
        )
      const result = response.data.data.users
      const code = response.data.errors.filter(
        (error) => !!error?.extensions?.code,
      )[0].extensions.code

      expect(result).toBe(null)
      expect(code).toBe('FORBIDDEN')
    })

    it('allows admin usage', async () => {
      const response = await userApi
        .users(adminToken)
        .catch((err) =>
          console.error(err?.response?.data || err?.response || err),
        )
      queryResult = response.data.data.users
      expect(response.data.errors).toBeUndefined()
    })

    it('returns valid users', async () => {
      await models.User.findOneAndDelete({
        email: userToListUsers.email,
      })
      const user = queryResult.filter(
        (user) => user.email === email,
      )[0]
      expect(user.id).toBeDefined()
      expect(user.email).toBe(email)
      expect(user.role).toBe('USER')
    })
  })

  describe('Query: user', () => {
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
          console.error(err?.response?.data || err?.response || err),
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
          console.error(err?.response?.data || err?.response || err),
        )
      queryResult = response.data.data.user
      expect(response.data.errors).toBeUndefined()
    })

    it('returns a valid user', async () => {
      await models.User.findOneAndDelete({ email: userToList.email })
      expect(queryResult.email).toBe(email)
      expect(queryResult.role).toBe('USER')
      expect(queryResult.id).toBeDefined()
    })
  })

  describe('Mutation: me', () => {
    it('returns an empty object when no token is provided', async () => {
      const response = await userApi
        .me()
        .catch((err) =>
          console.error(err?.response?.data || err?.response || err),
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
          console.error(err?.response?.data || err?.response || err),
        )
      await userToTestMe.remove()
      const result = response.data.data.me
      expect(result.email).toBe(email)
      expect(result.role).toBe('USER')
      expect(result.id).toBeDefined()
    })
  })

  describe('Mutation: signUp', () => {
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
          console.error(err?.response?.data || err?.response || err),
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

  describe('Mutation: signIn', () => {
    let response
    it('returns a valid token', async () => {
      response = await userApi
        .signIn({
          email: TEST_ADMIN,
          password: TEST_ADMIN_PASSWORD,
        })
        .catch((err) =>
          console.error(err?.response?.data || err?.response || err),
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

  describe('Mutation: signOut', () => {
    let response
    it('removes session from database', async () => {
      const signInResponse = await userApi
        .signIn({
          email: TEST_ADMIN,
          password: TEST_ADMIN_PASSWORD,
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
    // TODO : allDevices sessions
  })

  describe('Mutation: refreshToken', () => {
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
          email: TEST_ADMIN,
          password: TEST_ADMIN_PASSWORD,
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

  describe('Mutation: updateUser', () => {
    const email = 'testupdate@jest.test'

    it('updates user email address', async () => {
      const response = await userApi
        .updateUser(
          {
            email: email,
          },
          adminToken,
        )
        .catch((err) =>
          console.error(err?.response?.data || err?.response || err),
        )
      const user = response.data.data.updateUser

      // Put it back for later tests
      await models.User.findOneAndUpdate(
        { email: email },
        { email: TEST_ADMIN },
      )
      expect(user.email).toBe(email)
      expect(user.role).toBe('ADMIN')
      expect(user.id).toBeDefined()
    })
  })

  describe('Mutation: deleteUser', () => {
    const email = 'testdelete@jest.test'
    let userToDelete

    it('rejects non-admin usage', async () => {
      userToDelete = await models.User.create({
        email: email,
        password: '6df54g6d54g6hs6gfj46df4h6sd5f4g6ds54h6546f54h',
      }).catch(
        async () => await models.User.findOneAndDelete({ email }),
      )
      const { id, email: userEmail, role } = userToDelete
      const token = await jwt.sign(
        { id, email: userEmail, role },
        SECRET,
        {
          expiresIn: '30m',
        },
      )
      const response = await userApi
        .deleteUser(
          {
            id: userToDelete.id,
          },
          token,
        )
        .catch((err) =>
          console.error(err?.response?.data || err?.response || err),
        )
      const result = response.data
      const code = result.errors.filter(
        (error) => !!error?.extensions?.code,
      )[0].extensions.code

      expect(result.data).toBe(null)
      expect(code).toBe('FORBIDDEN')
    })

    it('allows admin usage', async () => {
      const response = await userApi
        .deleteUser(
          {
            id: userToDelete.id,
          },
          adminToken,
        )
        .catch((err) =>
          console.error(err?.response?.data || err?.response || err),
        )
      const result = response.data.data.deleteUser
      expect(result).toBe(true)
    })

    it('removes user from the db', async () => {
      const query = await models.User.findById(userToDelete.id)
      expect(query).toBe(null)
    })
  })
})
