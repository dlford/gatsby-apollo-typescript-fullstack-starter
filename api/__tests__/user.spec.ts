// import * as mongoose from 'mongoose'
import models, { connectDb } from '../src/models'
import * as api from './api'
import * as jwt from 'jsonwebtoken'

let db
const SECRET = process.env.SECRET || 'secret-stub'
const TEST_ADMIN = process.env.TEST_USER || 'admin@jest.test'
const TEST_ADMIN_PASSWORD =
  process.env.TEST_ADMIN_PASSWORD || '123456'

beforeAll(async () => {
  db = await connectDb()

  await models.User.create({
    email: TEST_ADMIN,
    password: TEST_ADMIN_PASSWORD,
    role: 'ADMIN',
  })

  /*
  const { id, email, role } = await models.User.findOne({
    email: TEST_ADMIN,
  })

  const TEST_ADMIN_TOKEN = await jwt.sign(
    { id, email, role },
    SECRET,
    { expiresIn: '30m' },
  )
  */
})

afterAll(async () => {
  await Promise.all([
    models.User.deleteOne({ email: TEST_ADMIN }),
    models.User.deleteOne({ email: 'user@jest.test' }),
  ])
  await db.connection.close()
})

describe('users', () => {
  describe('signUp', () => {
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

  describe('signIn', () => {
    it('returns a valid token', async () => {
      const response = await api
        .signIn({
          email: TEST_ADMIN,
          password: TEST_ADMIN_PASSWORD,
        })
        .catch((err) =>
          console.error(err.response.data || err.response || err),
        )
      console.log(response.data)
      const token = response.data.data.signIn.token
      const validated = await jwt.verify(token, SECRET)
      expect(validated.email).toBe(TEST_ADMIN)
      expect(validated.role).toBe('ADMIN')
    })
  })
})
