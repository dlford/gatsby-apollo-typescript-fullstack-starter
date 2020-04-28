import * as mongoose from 'mongoose'

import User, { UserDocument } from './user'
export { MeProps } from './user'

export type ModelTypes = {
  User: mongoose.Model<UserDocument>
}

const models = { User }

export const connectDb = (): Promise<typeof import('mongoose')> =>
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
