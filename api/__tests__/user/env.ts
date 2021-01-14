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
import { secret } from '../../src/constants'

let db
let adminUser

export const setup = async (
  adminEmail: string | void,
  adminPassword: string | void,
): Promise<string> => {
  db = await connectDb()

  if (adminEmail) {
    adminUser = await models.User.create({
      email: adminEmail,
      password: adminPassword,
      role: 'ADMIN',
    })

    const { id, email, role } = await models.User.findOne({
      email: adminEmail,
    })

    return await jwt.sign({ id, email, role }, secret, {
      expiresIn: '30m',
    })
  }

  return ''
}

export const teardown = async (): Promise<void> => {
  if (adminUser) {
    await adminUser.remove()
  }
  await db.connection.close()
}

export const env = {
  secret,
  models,
  userApi,
  jwt,
}
