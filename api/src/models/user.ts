import isEmail from 'validator/lib/isEmail'
import * as bcrypt from 'bcrypt'
import * as mongoose from 'mongoose'

export enum UserRole {
  'ADMIN',
  'USER',
}

export interface MeProps {
  id: string
  email: string
  role: UserRole
}

export interface UserDocument extends mongoose.Document {
  email: MeProps['email']
  role: MeProps['role']
  generatePasswordHash: Function
  validatePassword: Function
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

const User = mongoose.model<UserDocument>('User', userSchema)

export default User
