import * as http from 'http'
import * as cookieParser from 'cookie-parser'
import * as express from 'express'
import * as morgan from 'morgan'
import * as jwt from 'jsonwebtoken'
import * as useragent from 'express-useragent'
import * as requestIp from 'request-ip'
import * as httpHeadersPlugin from 'apollo-server-plugin-http-headers'
import {
  ApolloServer,
  AuthenticationError,
} from 'apollo-server-express'

import models, { connectDb, ModelTypes, MeProps } from './models'
import resolvers from './resolvers'
import schema from './schema'

export interface ContextProps {
  models: ModelTypes
  cookies: string
  setCookies: []
  useragent: useragent.Details
  ip: string
  me: MeProps
  secret: string
}

interface SubscriptionConnection {
  token: string
}

const SECRET = process.env.SECRET || 'secret-stub'

const app = express()
app.use(cookieParser())
app.use(useragent.express())
app.use(requestIp.mw())
app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'),
)

/**
 * Returns either a verified user object or null.
 */
const getMe = async (req): Promise<MeProps | void> => {
  const token = req.cookies['token'] || req.headers['token']
  if (!token) return null
  try {
    return await jwt.verify(token, SECRET)
  } catch (e) {
    console.error(e)
    throw new AuthenticationError(
      'Your session has expired. Please sign in again.',
    )
  }
}

const server = new ApolloServer({
  introspection: true,
  typeDefs: schema,
  resolvers,
  // cors: cors({ origin: 'http://localhost:3000', credentials: 'include' }), // TODO
  plugins: [httpHeadersPlugin],
  formatError: (error): Error => {
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
  context: async ({
    req,
    connection,
  }): Promise<ContextProps | void> => {
    if (connection) {
      return {
        ...connection.context,
        models,
      }
    }

    if (req) {
      const me = (await getMe(req)) || null

      return {
        models,
        cookies: req.cookies,
        setCookies: [],
        useragent: req.useragent,
        ip: req.clientIp,
        secret: SECRET,
        me,
      }
    }
  },
  subscriptions: {
    onConnect: async ({
      token,
    }: SubscriptionConnection): Promise<{ me: MeProps } | void> => {
      if (!token) return null
      const me: MeProps = (await jwt.verify(token, SECRET)) || null
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
