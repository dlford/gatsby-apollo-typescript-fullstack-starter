import { AuthenticationError, UserInputError } from 'apollo-server'
import { combineResolvers } from 'graphql-resolvers'
import * as jwt from 'jsonwebtoken'

import { isAdmin, isAuthenticated } from './authorization'
import { UserDocument } from '../models/user'
import { ContextProps } from '../app'

/**
 * Creates a signed JWT containing a user object.
 */

const createToken = async (
  user,
  secret,
  expiresIn,
): Promise<string> => {
  const { id, email, username, role } = user
  return await jwt.sign({ id, email, username, role }, secret, {
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

      return { token: await createToken(user, secret, '30d') }
    },

    signIn: async (
      _parent,
      { email, password },
      { models, secret }: ContextProps,
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

      return { token: await createToken(user, secret, '30m') }
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
  },
}
