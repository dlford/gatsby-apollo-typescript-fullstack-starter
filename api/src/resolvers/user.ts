import { AuthenticationError, UserInputError } from 'apollo-server'
import { combineResolvers } from 'graphql-resolvers'
import * as jwt from 'jsonwebtoken'

import { isAdmin, isAuthenticated } from './authorization'
import { UserDocument } from '../models/user'
import { SessionDocument } from '../models/session'
import { generateSessionString, UserSession } from './session'
import { ContextProps } from '../app'
import pubsub, { EVENTS } from '../subscription'

/**
 * Creates a signed JWT containing a user object.
 */

export const createToken = async (
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
      { models, secret }: ContextProps,
    ): Promise<{ token: string }> => {
      const user = await models.User.create({
        username,
        email,
        password,
      })

      // TODO
      return { token: await createToken(user, secret, '15m') }
    },

    signIn: async (
      _parent,
      { email, password },
      { models, secret, useragent, ip, res }: ContextProps,
    ): Promise<{ token: string }> => {
      const user = await models.User.findOne({ email: email })

      if (!user) {
        throw new UserInputError(
          'Email address or password incorrect.',
        )
      }

      const isValid = await user.validatePassword(password)

      if (!isValid) {
        throw new AuthenticationError(
          'Email address or password incorrect.',
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

      res.cookie('sessionId', session.id, {
        domain: 'localhost', // TODO
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: '/',
        sameSite: true,
        secure: false, // TODO
      })

      res.cookie('sessionToken', sessionToken, {
        domain: 'localhost', // TODO
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: '/',
        sameSite: true,
        secure: false, // TODO
      })

      await session.save()

      pubsub.publish(EVENTS.SESSION.CREATED, {
        sessionCreated: {
          session: {
            id: session.id,
            detail: generateSessionString(session),
          } as UserSession,
        },
      })

      return { token: await createToken(user, secret, '15m') }
    },

    signOut: async (
      _parent,
      _args,
      { models, cookies, res }: ContextProps,
    ): Promise<boolean> => {
      const { sessionId } = cookies

      const session = await models.Session.findById(sessionId)

      pubsub.publish(EVENTS.SESSION.DELETED, {
        sessionDeleted: {
          session: {
            id: session.id,
          } as UserSession,
        },
      })

      await session.remove()

      res.cookie('sessionId', '', {
        domain: 'localhost', // TODO
        httpOnly: true,
        maxAge: 0,
        path: '/',
        sameSite: true,
        secure: false, // TODO
      })

      res.cookie('sessionToken', '', {
        domain: 'localhost', // TODO
        httpOnly: true,
        maxAge: 0,
        path: '/',
        sameSite: true,
        secure: false, // TODO
      })

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
        return null
      }
      const { sessionId, sessionToken } = cookies
      const session: SessionDocument = await models.Session.findById(
        sessionId,
      )

      if (!session) {
        res.cookie('sessionId', '', {
          domain: 'localhost', // TODO
          httpOnly: true,
          maxAge: 0,
          path: '/',
          sameSite: true,
          secure: false, // TODO
        })

        res.cookie('sessionToken', '', {
          domain: 'localhost', // TODO
          httpOnly: true,
          maxAge: 0,
          path: '/',
          sameSite: true,
          secure: false, // TODO
        })

        return null
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

        res.cookie('sessionId', session.id, {
          domain: 'localhost', // TODO
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          path: '/',
          sameSite: true,
          secure: false, // TODO
        })

        res.cookie('sessionToken', newSessionToken, {
          domain: 'localhost', // TODO
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          path: '/',
          sameSite: true,
          secure: false, // TODO
        })

        return await createToken({ id, email, role }, secret, '15m')
      } catch (e) {
        console.error(e)
        return null
      }
    },
  },
}
