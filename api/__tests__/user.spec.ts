// import * as mongoose from 'mongoose'
import models, { connectDb } from '../src/models'
import * as api from './api'
import * as jwt from 'jsonwebtoken'

let db
const SECRET = process.env.SECRET || 'secret-stub'

beforeAll(async () => {
  db = await connectDb()

  await models.User.create({
    email: 'admin@jest.test',
    password: '123456',
    role: 'ADMIN',
  })
})

afterAll(async () => {
  await Promise.all([
    models.User.deleteOne({ email: 'admin@jest.test' }),
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
})
