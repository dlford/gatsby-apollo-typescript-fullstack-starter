import { AuthenticationError, UserInputError } from 'apollo-server'
import { combineResolvers } from 'graphql-resolvers'
import jwt from 'jsonwebtoken'

import { isAdmin, isAuthenticated } from './authorization'

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user
  return await jwt.sign({ id, email, username, role }, secret, {
    expiresIn,
  })
}

export default {
  Query: {
    users: async (_parent, _args, { models }) => {
      return await models.User.find()
    },
    user: async (_parent, { id }, { models }) => {
      return await models.User.findById(id)
    },
    me: async (_parent, _args, { models, me }) => {
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
      { models, secret },
    ) => {
      const user = await models.User.create({
        username,
        email,
        password,
      })

      return { token: createToken(user, secret, '30d') }
    },

    signIn: async (
      _parent,
      { login, password },
      { models, secret },
    ) => {
      const user = await models.User.findByLogin(login)

      if (!user) {
        throw new UserInputError(
          'No user found with this login credentials.',
        )
      }

      const isValid = await user.validatePassword(password)

      if (!isValid) {
        throw new AuthenticationError('Invalid password.')
      }

      return { token: createToken(user, secret, '30d') }
    },

    updateUser: combineResolvers(
      isAuthenticated,
      async (_parent, { email }, { models, me }) => {
        return await models.User.findByIdAndUpdate(
          me.id,
          { email },
          { new: true },
        )
      },
    ),

    deleteUser: combineResolvers(
      isAdmin,
      async (_parent, { id }, { models }) => {
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
