import { AuthenticationError, UserInputError } from 'apollo-server'
import { combineResolvers } from 'graphql-resolvers'

import { isAuthenticated } from './authorization'
import { EnabledTotp, GeneratedTotp } from '../models/user'
import { ContextProps } from '../app'

export default {
  Mutation: {
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
  },
}
