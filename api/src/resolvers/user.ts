import { AuthenticationError, UserInputError } from 'apollo-server'
import { combineResolvers } from 'graphql-resolvers'
import * as jwt from 'jsonwebtoken'

import { isAdmin, isAuthenticated } from './authorization'
import { UserDocument } from '../models/user'
import { ContextProps } from '../app'

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
      { models, secret, useragent, ip, res, cookies }: ContextProps,
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

      const session = await new models.Session({
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

      return { token: await createToken(user, secret, '15m') }
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
      { models, cookies, res, secret },
    ): Promise<string | null> => {
      if (!cookies.sessionId || !cookies.sessionToken) {
        return null
      }
      const { sessionId, sessionToken } = cookies
      const session = await models.Session.findById(sessionId)

      try {
        const sessionData = await jwt.verify(
          sessionToken,
          secret + session.salt,
        )

        const { id, email, role } = sessionData

        const newSalt = await session.generateSalt()
        await session.save()

        const newSessionToken = await jwt.sign(
          {
            id,
            email,
            role,
            iat: session.iat,
            exp: session.exp,
          },
          secret + newSalt,
        )

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
