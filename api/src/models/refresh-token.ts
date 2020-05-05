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

export interface RefreshTokenProps {
  id?: string
  userId: string
  iat: number
  exp: number
}

export interface RefreshTokenDocument extends mongoose.Document {
  id: RefreshTokenProps['id']
  userId: RefreshTokenProps['userId']
  iat: RefreshTokenProps['iat']
  exp: RefreshTokenProps['exp']
  generateAccessToken(): string
}

const SECRET = process.env.SECRET || 'secret-stub'

const refreshTokenSchema: mongoose.Schema = new mongoose.Schema({
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

// TODO : Don't renew refresh token here, make that initiate from the user side
refreshTokenSchema.methods.generateAccessToken = async function(
  this: RefreshTokenDocument,
): Promise<[string, string]> {
  const user = (await this.model('User').findById(
    this.userId,
  )) as UserDocument
  const { id, email, role } = user
  const refreshTokenData = {
    data: { userId: id },
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
  }
  const userToken = await jwt.sign({ id, email, role }, SECRET, '15m')
  const refreshToken = await jwt.sign(refreshTokenData, SECRET)
  this.exp = refreshTokenData.exp
  await this.save()
  return [userToken, refreshToken]
}

const RefreshToken = mongoose.model<RefreshTokenDocument>(
  'RefreshToken',
  refreshTokenSchema,
)

export default RefreshToken
