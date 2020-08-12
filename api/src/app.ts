/**
 * The built-in playground is disabled because it is useless for this app
 * since it can't set headers, instead use a desktop app such as graphiql-app,
 * insomnia REST client, or Altair, and run the signIn mutation, then add a
 * header called 'authorization' with the token returned from the signIn mutation
 * in the format of 'Bearer YOUR_TOKEN_HERE'
 *
 *
 * TODO :
 * - Add otplib and TOTP config
 * - document env vars
 *
 * @packageDocumentation
 */

import * as http from 'http'
import * as cookieParser from 'cookie-parser'
import * as express from 'express'
import * as morgan from 'morgan'
import * as jwt from 'jsonwebtoken'
import * as useragent from 'express-useragent'
import * as requestIp from 'request-ip'
import {
  ApolloServer,
  AuthenticationError,
} from 'apollo-server-express'

import { sessionScrubber } from './cronjobs'
import models, { connectDb, ModelTypes, MeProps } from './models'
import resolvers from './resolvers'
import schema from './schema'

export interface ContextProps {
  models: ModelTypes
  cookies: {
    sessionId: string
    sessionToken: string
  }
  useragent: useragent.Details
  ip: string
  me: MeProps
  res: express.Response
  secret: string
}

export interface CookieProps {
  name: string
  value: string // TODO
  options: {
    domain?: string
    httpOnly?: boolean
    maxAge?: number
    path?: string
    sameSite?: boolean
    secure?: boolean
  }
}

interface SubscriptionConnection {
  token: string
}

const SECRET = process.env.SECRET || 'secret-stub'
const CORS_HOSTS = process.env.CORS_HOSTS
  ? process.env.CORS_HOSTS.split(',')
  : ['http://localhost:8000', 'http://localhost:9000']
const CORS_HEADERS = process.env.CORS_HEADERS
  ? process.env.CORS_HEADERS.split(',')
  : ['Content-Type', 'Authorization']

const corsOptions = {
  origin: CORS_HOSTS,
  credentials: true,
  allowedHeaders: CORS_HEADERS,
}

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
  let bearer: string | void
  const authorization =
    req.headers['authorization'] || req.headers['Authorization']
  if (authorization) {
    bearer =
      new RegExp(/Bearer ([^,^ ]+)/).exec(authorization)[1] ||
      undefined
  }
  if (!bearer) return null
  try {
    return await jwt.verify(bearer, SECRET)
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
    res,
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
        useragent: req.useragent,
        ip: req.clientIp,
        secret: SECRET,
        res,
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
  playground: false,
})

server.applyMiddleware({ app, path: '/graphql', cors: corsOptions })

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

// The + in front of "process.env..." converts the variable to a number
const port = +process.env.PORT || 3000
const address = process.env.ADDRESS || '0.0.0.0'

connectDb().then(async () => {
  sessionScrubber.start()
  httpServer.listen(port, address, () => {
    console.log(
      `Apollo Server on http://localhost:${port}${server.graphqlPath}`,
    )
  })
})
