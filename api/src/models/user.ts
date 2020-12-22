/**
 * ## Types
 *
 * | Attribute       | Type                | Required | Default |
 * |-----------------|---------------------|----------|---------|
 * | id              | ID                  | *Auto    | *Auto   |
 * | email           | string              | true     | null    |
 * | password        | string              | true     | null    |
 * | totpEnabled     | boolean             | true     | false   |
 * | base32Secret    | string              | false    | null    |
 * | recoveryCodes   | string[]            | false    | null    |
 * | role            | enum(USER \| ADMIN) | true     | USER    |
 *
 * ## Methods
 *
 * - `generatePasswordHash()`: Creates a bcrypt hash of the users password for storage in DB. (Runs automatically when user is created).
 * - `validatePassword(password: string): boolean`: Returns true if supplied password matches hash in DB.
 * - `generateTotp()`: Stores a new TOTP secret to DB, returns the new secret and base64 data string for QR code.
 * - `validateTotp(token: string)`: Checks if a TOTP token is valid.
 * - `validateRecoveryCode(code: string)`: Returns true if a recovery code is valid (and removes it).
 * - `enableTotp(token: string)`: Checks if first TOTP token is valid, enables TOTP for user if so.
 * - `disableTotp(password: string)`: Disables TOTP for user if password is valid.
 *
 * @packageDocumentation
 */

import * as bcrypt from 'bcrypt'
import * as mongoose from 'mongoose'
import * as speakeasy from 'speakeasy'
import * as qrcode from 'qrcode'
import { base32 } from 'rfc4648'
import { randomBytes } from 'crypto'

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
  totpEnabled: boolean
  generatePasswordHash(): string
  validatePassword(password: string): boolean
  generateTotp(): GeneratedTotp
  enableTotp(token: string): EnabledTotp
  validateTotp(token: string): boolean
  validateRecoveryCode(code: string): boolean
  disableTotp(password: string): boolean
  password: string
  createdAt: Date
  updatedAt: Date
}

export interface GeneratedTotp extends speakeasy.GeneratedSecret {
  qr: string
}

export interface EnabledTotp {
  recoveryCodes?: string[]
  verified: boolean
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
    },
    base32Secret: {
      type: String,
    },
    recoveryCodes: [{ type: String }],
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

  const secret = speakeasy.generateSecret()
  const qr = await qrcode
    .toDataURL(secret.otpauth_url)
    .catch((err) => {
      console.error(err)
      throw new Error('Failed to generate TOTP QR Code')
    })

  this.base32Secret = secret.base32
  await this.save()

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

userSchema.methods.validateRecoveryCode = async function(
  code: string,
): Promise<boolean> {
  const availableCodes = this.recoveryCodes

  if (availableCodes.includes(code)) {
    this.recoveryCodes = availableCodes.filter(
      (item: string) => item !== code,
    )
    await this.save()

    return true
  }

  return false
}

userSchema.methods.enableTotp = async function(
  token: string,
): Promise<EnabledTotp> {
  if (this.totpEnabled) throw new Error('TOTP is already enabled')

  const verified = this.validateTotp(token)

  if (verified) {
    this.totpEnabled = true

    const recoveryCodes = ((): string[] => {
      const result = []
      for (let iteration = 0; iteration < 10; iteration++) {
        result.push(base32.stringify(randomBytes(20)))
      }
      return result
    })()

    this.recoveryCodes = recoveryCodes
    await this.save()

    return { verified, recoveryCodes }
  }

  return { verified }
}

userSchema.methods.disableTotp = async function(
  password: string,
): Promise<boolean> {
  const authenticated = await this.validatePassword(password)

  if (authenticated) {
    this.totpEnabled = undefined
    this.recoveryCodes = undefined
    this.base32Secret = undefined
    await this.save()
    return true
  }

  return false
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
