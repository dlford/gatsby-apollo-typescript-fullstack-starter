import http from 'http'

import {
  ApolloServer,
  AuthenticationError,
} from 'apollo-server-express'
import cookieParser from 'cookie-parser'
import express from 'express'
import jwt from 'jsonwebtoken'
import morgan from 'morgan'

import models, { connectDb, ModelProps, MeProps } from './models'
import resolvers from './resolvers'
import schema from './schema'

export interface ContextProps {
  models: ModelProps
  me: MeProps
  secret: string
}

interface SubscriptionConnection {
  token: string
}

const app = express()

app.use(cookieParser())

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'),
)

const getMe = async (req) => {
  const token = req.cookies['token'] || req.headers['token']

  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET)
    } catch (e) {
      throw new AuthenticationError(
        'Your session has expired. Please sign in again.',
      )
    }
  }
}

const server = new ApolloServer({
  introspection: true,
  typeDefs: schema,
  resolvers,
  // cors: cors({ origin: 'http://localhost:3000', credentials: 'include' }), // TODO
  formatError: (error) => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '')

    return {
      ...error,
      message,
    }
  },
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        ...connection.context,
        models,
      }
    }

    if (req) {
      const me = await getMe(req)

      return {
        models,
        me,
        secret: process.env.SECRET,
      }
    }
  },
  subscriptions: {
    onConnect: async ({ token }: SubscriptionConnection) => {
      const me = (await jwt.verify(token, process.env.SECRET)) || null
      return { me }
    },
  },
  playground:
    process.env.NODE_ENV === 'production'
      ? false
      : {
          settings: {
            'request.credentials': 'include',
          },
        },
})

server.applyMiddleware({ app, path: '/graphql' })

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

const port = process.env.PORT || 3000

connectDb().then(async () => {
  httpServer.listen({ port }, () => {
    console.log(
      `Apollo Server on http://localhost:${port}${server.graphqlPath}`,
    )
  })
})
