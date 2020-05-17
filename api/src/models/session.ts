/**
 * TODO
 * Fix types for useragent and ip
 *
 * ## Types
 *
 * ### SessionProps
 *
 * | Attribute | Type   | Required | Default       |
 * |-----------|--------|----------|---------------|
 * | id        | ID     | *Auto    | *Auto         |
 * | salt      | string | *Auto    | *Auto         |
 * | iat       | number | *Auto    | now           |
 * | exp       | number | *Auto    | now + 30 days |
 *
 * ### SessionDocument TODO
 *
 * | Attribute | Type                | Required | Default |
 * |-----------|---------------------|----------|---------|
 * | id        | string              | *Auto    | *Auto   |
 * | userId    | string              | true     | null    |
 * | email     | string              | true     | null    |
 * | role      | enum(USER \| ADMIN) | true     | USER    |
 * | iat       | number              | true     | null    |
 * | exp       | number              | true     | null    |
 *
 * ## Methods
 *
 * - `generateSalt()`: Returns a new salt for associated session after saving it to the database.
 *
 * @packageDocumentation
 */

import * as mongoose from 'mongoose'
import { Details } from 'express-useragent'

import { MeProps } from './user'

export interface SessionProps extends MeProps {
  ip: string
  salt: string
  iat: number
  exp: number
}

export interface SessionDocument extends mongoose.Document {
  id: SessionProps['id']
  userId: MeProps['id']
  ip: string
  useragent: Details
  salt: string
  iat: SessionProps['iat']
  exp: SessionProps['exp']
  generateSalt(): string
}

/**
 * Creates a Universally Unique Identifier, used as a salt for session token signing.
 */

const createUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function(c) {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    },
  )
}

const sessionSchema: mongoose.Schema = new mongoose.Schema({
  salt: {
    type: String,
    unique: true,
    default: (): string => createUUID(),
  },
  userId: {
    type: String,
  },
  iat: {
    type: Number,
    default: Math.floor(Date.now() / 1000), // Now
  },
  exp: {
    type: Number,
    default: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 Days
  },
  useragent: {
    type: Object,
  },
  ip: {
    type: String,
  },
})

sessionSchema.methods.generateSalt = async function(
  this: SessionDocument,
): Promise<string> {
  const salt = createUUID()
  this.salt = salt
  await this.save()
  return salt
}

sessionSchema.pre('save', function(this: SessionDocument): void {
  this.iat = Math.floor(Date.now() / 1000)
  this.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 // 30 Days
})

const Session = mongoose.model<SessionDocument>(
  'Session',
  sessionSchema,
)

export default Session
