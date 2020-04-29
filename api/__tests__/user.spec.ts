// import * as mongoose from 'mongoose'
import models, { connectDb } from '../src/models'
import * as api from './api'
import * as jwt from 'jsonwebtoken'

let db
let adminToken
const SECRET = process.env.SECRET || 'secret-stub'
const TEST_ADMIN = process.env.TEST_ADMIN || 'admin@jest.test'
const TEST_ADMIN_PASSWORD =
  process.env.TEST_ADMIN_PASSWORD || '12345678'

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
  describe('Mutation: signUp', () => {
    it('returns a valid token', async () => {
      const response = await api
        .signUp({
          email: 'user@jest.test',
          password: 'password',
        })
        .catch((err) =>
          console.error(err.response.data || err.response || err),
        )
      const token = response.data.data.signUp.token
      const validated = await jwt.verify(token, SECRET)
      expect(validated.email).toBe('user@jest.test')
      expect(validated.role).toBe('USER')
    })
    it('creates a user in DB', async () => {
      const user = await models.User.findOne({
        email: 'user@jest.test',
      })
      expect(user.id).toBeDefined()
      expect(user.email).toBe('user@jest.test')
      expect(user.role).toBe('USER')
    })
  })

  describe('Mutation: signIn', () => {
    it('returns a valid token', async () => {
      const response = await api
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
    const newEmail = 'itworked@jest.test'
    it('updates user email address', async () => {
      const response = await api
        .updateUser(
          {
            email: newEmail,
          },
          adminToken,
        )
        .catch((err) =>
          console.error(err.response.data || err.response || err),
        )
      const user = response.data.data.updateUser

      // Put it back for later tests
      await models.User.findOneAndUpdate(
        { email: newEmail },
        { email: TEST_ADMIN },
      )

      expect(user.email).toBe(newEmail)
    })
  })
})
