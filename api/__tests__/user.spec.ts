// import * as mongoose from 'mongoose'
import models, { connectDb } from '../src/models'
import * as userApi from './api/user'
import * as jwt from 'jsonwebtoken'

let db
let adminToken
const SECRET = process.env.SECRET || 'secret-stub'
const TEST_ADMIN = process.env.TEST_ADMIN || 'admin@jest.test'
const TEST_ADMIN_PASSWORD =
  process.env.TEST_ADMIN_PASSWORD ||
  '394nv9349cr2m02mc028y3c9eytn7ioc348cur984yrcn93ceoo'

beforeAll(async () => {
  db = await connectDb()

  /* eslint-disable @typescript-eslint/no-empty-function */
  await models.User.create({
    email: TEST_ADMIN,
    password: TEST_ADMIN_PASSWORD,
    role: 'ADMIN',
  }).catch(() => {})
  /* eslint-enable @typescript-eslint/no-empty-function */

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
    let userToDelete

    it('rejects non-admin usage', async () => {
      userToDelete = await models.User.create({
        email: email,
        password: '6df54g6d54g6hs6gfj46df4h6sd5f4g6ds54h6546f54h',
      }).catch(
        async () => await models.User.findOneAndDelete({ email }),
      )
      const { id, email: userEmail, role } = userToDelete
      const token = await jwt.sign({ id, userEmail, role }, SECRET, {
        expiresIn: '30m',
      })
      const response = await userApi
        .users(token)
        .catch((err) =>
          console.error(err.response.data || err.response || err),
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
          console.error(err.response.data || err.response || err),
        )
      const result = response.data.data.users
      await models.User.findOneAndDelete({ id: userToDelete.id })
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('Mutation: signUp', () => {
    const email = 'testcreate@jest.test'

    it('returns a valid token', async () => {
      const response = await userApi
        .signUp({
          email: email,
          password:
            '65h45d4fh6d54g6s54gd64hg4h6gs4gs54dg6s4g646s6gd54s4',
        })
        .catch((err) =>
          console.error(err.response.data || err.response || err),
        )
      const token = response.data.data.signUp.token
      const validated = await jwt.verify(token, SECRET)
      expect(validated.email).toBe(email)
      expect(validated.role).toBe('USER')
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
    it('returns a valid token', async () => {
      const response = await userApi
        .signIn({
          email: TEST_ADMIN,
          password: TEST_ADMIN_PASSWORD,
        })
        .catch((err) =>
          console.error(err.response.data || err.response || err),
        )
      const token = response.data.data.signIn.token
      const validated = await jwt.verify(token, SECRET)
      expect(validated.email).toBe(TEST_ADMIN)
      expect(validated.role).toBe('ADMIN')
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
          console.error(err.response.data || err.response || err),
        )
      const user = response.data.data.updateUser

      // Put it back for later tests
      await models.User.findOneAndUpdate(
        { email: email },
        { email: TEST_ADMIN },
      )
      expect(user.email).toBe(email)
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
      const token = await jwt.sign({ id, userEmail, role }, SECRET, {
        expiresIn: '30m',
      })
      const response = await userApi
        .deleteUser(
          {
            id: userToDelete.id,
          },
          token,
        )
        .catch((err) =>
          console.error(err.response.data || err.response || err),
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
          console.error(err.response.data || err.response || err),
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
