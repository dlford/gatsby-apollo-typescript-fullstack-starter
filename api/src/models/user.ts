/**
 * TODO : Replace email validator with scalar
 *
 * ## Types
 *
 * | Attribute | Type                | Required | Default |
 * |-----------|---------------------|----------|---------|
 * | id        | ID                  | *Auto    | *Auto   |
 * | email     | string              | true     | null    |
 * | role      | enum(USER \| ADMIN) | true     | USER    |
 *
 * ## Methods
 *
 * - `generatePasswordHash()`: Creates a bcrypt hash of the users password for storage in DB. (Runs automatically when user is created).
 * - `validatePassword(password: string): boolean`: Returns true if supplied password matches hash in DB.
 *
 * @packageDocumentation
 */

import isEmail from 'validator/lib/isEmail'
import * as bcrypt from 'bcrypt'
import * as mongoose from 'mongoose'

export enum UserRole {
  admin = 'ADMIN',
  user = 'USER',
}

export interface MeProps {
  id: string
  email: string
  role: UserRole
}

export interface UserDocument extends mongoose.Document {
  email: MeProps['email']
  role: MeProps['role']
  generatePasswordHash(): string
  validatePassword(password: string): boolean
  password: string
  createdAt: Date
  updatedAt: Date
}

const userSchema: mongoose.Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      validate: [isEmail, 'No valid email address provided.'],
    },
    password: {
      type: String,
      required: [true, 'Password cannot be empty.'],
    },
    role: {
      type: String,
      enum: {
        values: ['ADMIN', 'USER'],
        message: 'Invalid user role.',
      },
      default: 'USER',
    },
  },
  {
    timestamps: true,
  },
)

userSchema.methods.generatePasswordHash = async function(): Promise<
  string
> {
  const saltRounds = 10
  return await bcrypt.hash(this.password, saltRounds)
}

userSchema.methods.validatePassword = async function(
  password,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password)
}

userSchema.pre('save', async function(
  this: UserDocument,
): Promise<void> {
  if (this.isNew) {
    const hash = await this.generatePasswordHash()
    this.password = hash
  }
})

userSchema.pre('remove', async function(
  this: UserDocument,
): Promise<void> {
  await this.model('Session').deleteMany({ userId: this.id })
})

const User = mongoose.model<UserDocument>('User', userSchema)

export default User
