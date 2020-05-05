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
// import * as jwt from 'jsonwebtoken'

// import { createToken } from '../app'
// import { MeProps, UserDocument } from './user'

export interface RefreshTokenProps {
  id: string
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

/*
refreshTokenSchema.methods.generateAccessToken = async function(
  this: RefreshTokenDocument
): Promise<
  MeProps
> {
  const user = await this.model('User').findById(this.userId) as UserDocument
  const { id, email, role } = user
}
*/

const RefreshToken = mongoose.model<RefreshTokenDocument>(
  'RefreshToken',
  refreshTokenSchema,
)

export default RefreshToken
