/**
 * ## Types
 *
 * | Attribute    | Type                | Required | Default |
 * |--------------|---------------------|----------|---------|
 * | id           | ID                  | *Auto    | *Auto   |
 * | email        | string              | true     | null    |
 * | password     | string              | true     | null    |
 * | totpEnabled  | boolean             | true     | false   |
 * | base32Secret | string              | false    | null    |
 * | recoveryCode | string              | false    | null    |
 * | role         | enum(USER \| ADMIN) | true     | USER    |
 *
 * ## Methods
 *
 * - `generatePasswordHash()`: Creates a bcrypt hash of the users password for storage in DB. (Runs automatically when user is created).
 * - `validatePassword(password: string): boolean`: Returns true if supplied password matches hash in DB.
 * - `generateTotp()`: Stores a new TOTP secret to DB, returns the new secret and base64 data string for QR code.
 * - `validateTotp(token: string)`: Checks if a TOTP token is valid.
 * - `enableTotp(token: string)`: Checks if first TOTP token is valid, enables TOTP for user if so.
 * - `disableTotp(password: string)`: Disables TOTP for user if password is valid.
 *
 * @packageDocumentation
 */

import * as bcrypt from 'bcrypt'
import * as mongoose from 'mongoose'
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'

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

export interface GeneratedTotp extends speakeasy.GeneratedSecret {
  qr: string
}

const userSchema: mongoose.Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: [true, 'Password cannot be empty.'],
    },
    totpEnabled: {
      type: Boolean,
      default: false,
      required: true,
    },
    base32Secret: {
      type: String,
    },
    recoveryCode: {
      type: String,
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
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateTotp = async function(): Promise<
  GeneratedTotp
> {
  // TODO: handle TOTP already enabled
  if (this.totpEnabled) throw new Error('TOTP is already enabled')

  // TODO: Create recoveryCode

  const secret = speakeasy.generateSecret()
  const qr = await qrcode
    .toDataURL(secret.otpauth_url)
    .catch((err) => {
      console.error(err)
      throw new Error('Failed to generate TOTP QR Code')
    })

  this.base32Secret = secret.base32

  return { ...secret, qr }
}

userSchema.methods.validateTotp = function(token: string): boolean {
  const verified = speakeasy.totp.verify({
    secret: this?.base32Secret,
    encoding: 'base32',
    token,
  })

  return verified
}

userSchema.methods.enableTotp = function(token: string): boolean {
  const verified = this.validateTotp(token)

  if (verified) this.totpEnabled = true

  return verified
}

userSchema.methods.disableTotp = async function(
  password: string,
): Promise<boolean> {
  const authenticated = await this.validatePassword(password)

  if (authenticated) {
    this.totpEnabled = false
    return true
  }

  return false
}

userSchema.pre('save', async function(
  this: UserDocument,
): Promise<void> {
  if (this.isNew) {
    const hash = this.generatePasswordHash()
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
