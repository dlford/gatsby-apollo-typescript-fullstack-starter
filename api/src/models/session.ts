/**
 * ## Types
 *
 * | Attribute | Type                | Required | Default |
 * |-----------|---------------------|----------|---------|
 * | id        | ID                  | *Auto    | *Auto   |
 * | userId    | string              | true     | null    |
 * | iat       | number              | *Auto    | *Auto   |
 * | exp       | number              | *Auto    | *Auto   |
 *
 * ## Methods
 *
 * - `generateAccessToken()`: Creates a new access token for associated user, then renews itself.
 *
 * @packageDocumentation
 */

import * as mongoose from 'mongoose'
import * as jwt from 'jsonwebtoken'

import { UserDocument } from './user'

export interface SessionProps {
  id?: string
  userId: string
  iat: number
  exp: number
}

export interface SessionDocument extends mongoose.Document {
  id: SessionProps['id']
  userId: SessionProps['userId']
  iat: SessionProps['iat']
  exp: SessionProps['exp']
  generateAccessToken(): string
}

const SECRET = process.env.SECRET || 'secret-stub'

const sessionSchema: mongoose.Schema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: [true, 'User ID required.'],
  },
  iat: {
    type: Number,
    required: [true, 'Issue date required.'],
  },
  exp: {
    type: Number,
    required: [true, 'Expire date required.'],
  },
})

// TODO : convert this to session collection with a salt for each session,
// browser/IP metadata with it, add session salt to jwt secret, store session
// ID and salt in cookies, user can review and de-auth any or all sessions.
// Cycle salt with each request and return new salt + new access/session tokens.
// Drop session and start a new one if salt mis-match to de-auth hijacked
// sessions when the legitimate user signs in. Only send access token on client
// side, server will send new salt and session token in response.
// set session ID and session token cookies from Express as httponly!

sessionSchema.methods.generateAccessToken = async function(
  this: SessionDocument,
): Promise<[string, string]> {
  const user = (await this.model('User').findById(
    this.userId,
  )) as UserDocument
  const { id, email, role } = user
  const sessionData = {
    data: { userId: id },
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
  }
  const userToken = await jwt.sign({ id, email, role }, SECRET, '15m')
  const session = await jwt.sign(sessionData, SECRET)
  this.exp = sessionData.exp
  await this.save()
  return [userToken, session]
}

const Session = mongoose.model<SessionDocument>(
  'Session',
  sessionSchema,
)

export default Session
