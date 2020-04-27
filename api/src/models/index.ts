import mongoose from 'mongoose'

import User, { UserDocument } from './user'

export { MeProps } from './user'

export interface ModelProps {
  User: UserDocument
}

const models = { User }

if (!process.env.DATABASE_URL) throw new Error('Missing MongoDB URL')

export const connectDb = () =>
  mongoose.connect(
    process.env.DATABASE_URL ||
      'mongodb://localhost:27017/development',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
  )

export default models
