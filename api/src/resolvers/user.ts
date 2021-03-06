import { AuthenticationError, UserInputError } from 'apollo-server'
import { combineResolvers } from 'graphql-resolvers'
import * as jwt from 'jsonwebtoken'

import { isAdmin, isAuthenticated } from './authorization'
import {
  UserDocument,
  EnabledTotp,
  GeneratedTotp,
} from '../models/user'
import { SessionDocument } from '../models/session'
import { generateSessionString } from './session'
import { ContextProps } from '../app'
import pubsub, { EVENTS } from '../subscription'
import { isSignUpDisabled } from '../constants'

/**
 * Default values for Set-Cookie headers
 */

const cookieProps = {
  domain: 'localhost', // TODO
  httpOnly: true,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  path: '/',
  sameSite: true,
  secure: false, // TODO
}

/**
 * Creates a signed JWT containing a user object.
 */

const createAccessToken = async (
  user,
  secret,
  expiresIn,
): Promise<string> => {
  const { id, email, role } = user
  return await jwt.sign({ id, email, role }, secret, {
    expiresIn,
  })
}

export default {
  Query: {
    users: combineResolvers(
      isAdmin,
      async (
        _parent,
        _args,
        { models }: ContextProps,
      ): Promise<UserDocument[]> => {
        return await models.User.find()
      },
    ),
    user: combineResolvers(
      isAdmin,
      async (
        _parent,
        { id },
        { models }: ContextProps,
      ): Promise<UserDocument> => {
        return await models.User.findById(id)
      },
    ),
    me: async (
      _parent,
      _args,
      { models, me }: ContextProps,
    ): Promise<UserDocument> => {
      if (!me) {
        return null
      }
      return await models.User.findById(me.id)
    },
  },

  Mutation: {
    signUp: async (
      _parent,
      { username, email, password },
      { models, secret, useragent, ip, res }: ContextProps,
    ): Promise<{ token: string }> => {
      if (isSignUpDisabled)
        throw new UserInputError(
          'Sign up is disabled by administrator',
        )

      const user = new models.User({
        username,
        email,
        password,
      })

      await user.save()

      const session: SessionDocument = await new models.Session({
        userId: user.id,
        useragent,
        ip,
      })

      const sessionToken = await jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          iat: session.iat,
          exp: session.exp,
        },
        secret + session.salt,
      )

      res.cookie('sessionId', session.id, cookieProps)
      res.cookie('sessionToken', sessionToken, cookieProps)

      await session.save()

      return { token: await createAccessToken(user, secret, '15m') }
    },

    signIn: async (
      _parent,
      { email, password },
      { models, secret, useragent, ip, res }: ContextProps,
    ): Promise<{ token: string; totpIntercept: boolean }> => {
      const user = await models.User.findOne({ email: email })

      if (!user) {
        throw new UserInputError(
          'Email address or password incorrect',
        )
      }

      const isValid = await user.validatePassword(password)

      if (!isValid) {
        throw new AuthenticationError(
          'Email address or password incorrect',
        )
      }

      if (user.totpEnabled) {
        const totpSignInToken = await jwt.sign(
          { userId: user.id },
          secret,
          {
            expiresIn: '5m',
          },
        )
        return { token: totpSignInToken, totpIntercept: true }
      }

      const session: SessionDocument = await new models.Session({
        userId: user.id,
        useragent,
        ip,
      })

      const sessionToken = await jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          iat: session.iat,
          exp: session.exp,
        },
        secret + session.salt,
      )

      res.cookie('sessionId', session.id, cookieProps)
      res.cookie('sessionToken', sessionToken, cookieProps)

      await session.save()

      pubsub.publish(EVENTS.SESSION.CREATED, {
        sessionCreated: {
          session: {
            id: session.id,
            detail: generateSessionString(session),
            // No need to check this here,
            // but isCurrent must be in response.
            isCurrent: false,
          },
        },
        userId: session.userId,
      })

      return {
        token: await createAccessToken(user, secret, '15m'),
        totpIntercept: false,
      }
    },

    totpSignIn: async (
      _parent,
      { token, recoveryCode, totpSignInToken },
      { models, secret, useragent, ip, res }: ContextProps,
    ): Promise<{ token: string; totpIntercept: boolean }> => {
      let userId: string
      try {
        const totpSignInData = await jwt.verify(
          totpSignInToken,
          secret,
        )
        userId = totpSignInData.userId
      } catch {
        throw new AuthenticationError(
          'Your session has expired, please sign in again',
        )
      }

      const user = await models.User.findById(userId)

      if (!user) {
        throw new UserInputError('Unable to find user')
      }

      if (token) {
        const isValid = await user.validateTotp(token)

        if (!isValid) {
          throw new AuthenticationError('Invalid TOTP token')
        }
      } else if (recoveryCode) {
        const isValid = await user.validateRecoveryCode(recoveryCode)

        if (!isValid) {
          throw new AuthenticationError('Invalid recovery code')
        }
      } else {
        throw new AuthenticationError(
          'A TOTP token or recovery code is required',
        )
      }

      const session: SessionDocument = await new models.Session({
        userId: user.id,
        useragent,
        ip,
      })

      const sessionToken = await jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          iat: session.iat,
          exp: session.exp,
        },
        secret + session.salt,
      )

      res.cookie('sessionId', session.id, cookieProps)
      res.cookie('sessionToken', sessionToken, cookieProps)

      await session.save()

      pubsub.publish(EVENTS.SESSION.CREATED, {
        sessionCreated: {
          session: {
            id: session.id,
            detail: generateSessionString(session),
            // No need to check this here,
            // but isCurrent must be in response.
            isCurrent: false,
          },
        },
        userId: session.userId,
      })

      return {
        token: await createAccessToken(user, secret, '15m'),
        totpIntercept: false,
      }
    },

    setupTotp: combineResolvers(
      isAuthenticated,
      async (
        _parent: {},
        _args: {},
        { models, me }: ContextProps,
      ): Promise<GeneratedTotp> => {
        const user = await models.User.findById(me.id)
        return await user.generateTotp()
      },
    ),

    enableTotp: combineResolvers(
      isAuthenticated,
      async (
        _parent: {},
        { token },
        { models, me }: ContextProps,
      ): Promise<EnabledTotp> => {
        const user = await models.User.findById(me.id)
        const result = await user.enableTotp(token)

        if (result.verified) {
          return result
        }

        throw new UserInputError('Invalid TOTP token')
      },
    ),

    disableTotp: combineResolvers(
      isAuthenticated,
      async (
        _parent: {},
        { password },
        { models, me }: ContextProps,
      ): Promise<boolean> => {
        const user = await models.User.findById(me.id)
        const result = await user.disableTotp(password)

        if (result) return result

        throw new AuthenticationError('Password incorrect')
      },
    ),

    signOut: async (
      _parent,
      { allDevices },
      { models, cookies, res }: ContextProps,
    ): Promise<boolean> => {
      const { sessionId } = cookies

      const session = await models.Session.findById(sessionId)

      if (!session) throw new UserInputError('Could not find session')

      pubsub.publish(EVENTS.SESSION.DELETED, {
        sessionDeleted: {
          session: {
            id: session.id,
          },
        },
        userId: session.userId,
      })

      await session.remove()

      res.cookie('sessionId', '', { ...cookieProps, maxAge: 0 })
      res.cookie('sessionToken', '', { ...cookieProps, maxAge: 0 })

      if (allDevices) {
        const sessions = await models.Session.find({
          userId: session.userId,
        })
        sessions.map(async (session) => {
          pubsub.publish(EVENTS.SESSION.DELETED, {
            sessionDeleted: {
              session: {
                id: session.id,
              },
            },
            userId: session.userId,
          })

          await session.remove()
        })
      }

      return true
    },

    updateUser: combineResolvers(
      isAuthenticated,
      async (_parent, { email }, { models, me }: ContextProps) => {
        return await models.User.findByIdAndUpdate(
          me.id,
          { email },
          { new: true },
        )
      },
    ),

    deleteUser: combineResolvers(
      isAdmin,
      async (_parent, { id }, { models }: ContextProps) => {
        const user = await models.User.findById(id)

        if (user) {
          await user.remove()
          return true
        } else {
          return false
        }
      },
    ),

    refreshToken: async (
      _parent,
      _args,
      { models, cookies, res, secret, useragent, ip }: ContextProps,
    ): Promise<string | null> => {
      if (!cookies.sessionId || !cookies.sessionToken) {
        res.cookie('sessionId', '', { ...cookieProps, maxAge: 0 })
        res.cookie('sessionToken', '', { ...cookieProps, maxAge: 0 })
        throw new AuthenticationError('Your session has expired')
      }

      const { sessionId, sessionToken } = cookies
      const session: SessionDocument = await models.Session.findById(
        sessionId,
      )

      if (!session) {
        pubsub.publish(EVENTS.SESSION.DELETED, {
          sessionDeleted: {
            session: {
              id: sessionId,
            },
          },
          userId: session.userId,
        })

        res.cookie('sessionId', '', { ...cookieProps, maxAge: 0 })
        res.cookie('sessionToken', '', { ...cookieProps, maxAge: 0 })

        throw new AuthenticationError('Your session has expired')
      }

      try {
        const sessionData = await jwt.verify(
          sessionToken,
          secret + session.salt,
        )

        const { id, email, role } = sessionData

        session.salt = await session.generateSalt()
        session.useragent = useragent
        session.ip = ip
        await session.save()

        pubsub.publish(EVENTS.SESSION.UPDATED, {
          sessionUpdated: {
            session: {
              id: sessionId,
              detail: generateSessionString(session),
            },
          },
          userId: session.userId,
        })

        const newSessionToken = await jwt.sign(
          {
            id,
            email,
            role,
            iat: session.iat,
            exp: session.exp,
          },
          secret + session.salt,
        )

        res.cookie('sessionId', session.id, cookieProps)
        res.cookie('sessionToken', newSessionToken, cookieProps)

        return await createAccessToken(
          { id, email, role },
          secret,
          '15m',
        )
      } catch (e) {
        console.error(e)
        res.cookie('sessionId', '', { ...cookieProps, maxAge: 0 })
        res.cookie('sessionToken', '', { ...cookieProps, maxAge: 0 })
        if (session) {
          await models.Session.remove({ userId: session.userId })
        }
        throw new AuthenticationError(
          'Failed to verify session token',
        )
      }
    },
  },
}
