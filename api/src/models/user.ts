import isEmail from 'validator/lib/isEmail'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

export enum UserRole {
  'ADMIN',
  'USER',
}

export interface MeProps {
  email: string
  role: UserRole
}

export interface UserDocument extends mongoose.Document {
  email: MeProps['email']
  role: MeProps['role']
  password: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new mongoose.Schema(
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
      minlength: [7, 'Password must be at least 7 characters.'],
      maxlength: [42, 'Password must be shorter than 42 characters'],
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

userSchema.statics.findByLogin = async function(
  login,
): Promise<UserDocument | null> {
  let user = await this.findOne({
    username: login,
  })

  if (!user) {
    user = await this.findOne({ email: login })
  }

  return user
}

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
