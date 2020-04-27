import mongoose from 'mongoose'

import User from './user'

const models = { User }

if (!process.env.DATABASE_URL) throw new Error('Missing MongoDB URL')

export const connectDb = mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

export default models
