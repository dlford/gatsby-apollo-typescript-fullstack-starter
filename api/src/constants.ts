/**
 * True if `NODE_ENV` is `production`
 */

export const isProduction = process.env.NODE_ENV === 'production'

/**
 * Random character string for signing JSON web tokens
 */

export const secret = process.env.SECRET || 'secret-stub'

/**
 * Hosts to allow cross-site requests from, comma separated
 */

export const corsHosts = process.env.CORS_HOSTS
  ? process.env.CORS_HOSTS.split(',')
  : ['http://localhost:8000', 'http://localhost:9000']

/**
 * Headers to allow via CORS, comma separated
 */

export const corsHeaders = process.env.CORS_HEADERS
  ? process.env.CORS_HEADERS.split(',')
  : ['Content-Type', 'Authorization']

/**
 * Port to listen on
 */

export const port = +process.env.PORT || 3000

/**
 * Address to listen on
 */

export const address = process.env.ADDRESS || '0.0.0.0'

/**
 * Interval for scrubbing expired sessions from
 * database, expressed in cron format
 */

export const scrubSessionsCron =
  process.env.SCRUB_SESSIONS_CRON || '0 * * * *'

/**
 * MongoDB connection URL
 */

export const databaseUrl =
  process.env.DATABASE_URL || 'mongodb://localhost:27017/development'

/**
 * Option to disable sign-up feature, set to "true" to disable
 */

export const isSignUpDisabled = process.env.DISABLE_SIGNUP === 'true'
