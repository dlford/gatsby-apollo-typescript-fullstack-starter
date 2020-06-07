/**
 * Note: The preferred technique here would be a custom
 * Jest environment, but at the time of writing Jest
 * does not support TypeScript or ES6 environment classes,
 * so it would be impossible to import "models", this is
 * a workaround to separate test files with a common
 * environment.
 */

import models, { connectDb } from '../../src/models'
import * as userApi from '../api/user'
import * as jwt from 'jsonwebtoken'

/* TODO
 * - test deleted session on delete user
 * - test no cookies when sign in fails
 * - test clear cookies when refreshToken fails
 * - test session deleted if refreshToken invalid
 */

let db
const SECRET = process.env.SECRET || 'secret-stub'
const TEST_ADMIN = 'admin@jest.test'
const TEST_ADMIN_PASSWORD =
  '394nv9349cr2m02mc028y3c9eytn7ioc348cur984yrcn93ceoo'

export const setup = async (): Promise<string> => {
  db = await connectDb()

  await models.User.create({
    email: TEST_ADMIN,
    password: TEST_ADMIN_PASSWORD,
    role: 'ADMIN',
  })

  const { id, email, role } = await models.User.findOne({
    email: TEST_ADMIN,
  })

  return await jwt.sign({ id, email, role }, SECRET, {
    expiresIn: '30m',
  })
}

export const teardown = async (): Promise<void> => {
  await Promise.all([
    models.User.deleteOne({ email: TEST_ADMIN }),
    models.User.deleteOne({ email: 'user@jest.test' }),
  ])
  await db.connection.close()
}

export const env = {
  SECRET,
  TEST_ADMIN,
  TEST_ADMIN_PASSWORD,
  models,
  userApi,
  jwt,
}
