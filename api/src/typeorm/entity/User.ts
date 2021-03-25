import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Unique,
  BeforeInsert,
  BeforeRemove,
} from 'typeorm'
import * as bcrypt from 'bcrypt'
import * as mongoose from 'mongoose'
import * as speakeasy from 'speakeasy'
import * as qrcode from 'qrcode'
import { base32 } from 'rfc4648'
import { randomBytes } from 'crypto'
import { ApolloError, UserInputError } from 'apollo-server'

export enum UserRole {
  admin = 'ADMIN',
  user = 'USER',
}

export interface MeProps {
  id: string
  email: string
  role: UserRole
}

export interface UserDocument {
  email: MeProps['email']
  role: MeProps['role']
  totpEnabled: boolean
  recoveryCodes?: string[]
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

@Entity()
@Unique(['email'])
export default class User extends BaseEntity implements UserDocument {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  email: string

  @Column({ nullable: false })
  password: string

  @column({ type: 'boolean', default: false })
  totpEnabled: boolean

  @column()
  base32Secret: string

  @Column({ type: 'text', array: true, default: {} })
  recoveryCodes: string[]

  @Column({ type: 'text', default: UserRole.user })
  role: UserRole

  async generatePasswordHash(): Promise<string> {
    const saltRounds = 10
    return await bcrypt.hash(this.password, saltRounds)
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
  }

  async generateTotp(): Promise<GeneratedTotp> {
    if (this.totpEnabled)
      throw new UserInputError('TOTP is already enabled')

    const secret = speakeasy.generateSecret()
    const qr = await qrcode
      .toDataURL(secret.otpauth_url)
      .catch((err) => {
        console.error(err)
        throw new ApolloError('Failed to generate TOTP QR Code')
      })

    this.base32Secret = secret.base32
    await this.save()

    return { ...secret, qr }
  }

  async validateTotp(token: string): boolean {
    const verified = speakeasy.totp.verify({
      secret: this?.base32Secret,
      encoding: 'base32',
      token,
    })

    return verified
  }

  async validateRecoveryCode(code: string): Pormise<boolean> {
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

  async enableTotp(token: string) {
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

  async disableTotp(password: string) {
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

  @BeforeInsert()
  convertPasswordToHash() {
    const hash = await this.generatePasswordHash()
    this.password = hash
  }

  @BeforeRemove()
  cleanupSessions() {
    await this.model('Session').deleteMany({ userId: this.id })
  }
}
