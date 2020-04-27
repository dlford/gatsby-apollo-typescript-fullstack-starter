import { ForbiddenError } from 'apollo-server'
import { combineResolvers, skip } from 'graphql-resolvers'

import { UserRole } from '~/models/user'

export const isAuthenticated = (_parent, _args, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated as user.')

export const isAdmin = combineResolvers(
  isAuthenticated,
  (_parent, _args, { me: { role } }) => {
    switch (+role) {
      case UserRole.ADMIN:
        return skip
        break
      default:
        return new ForbiddenError('Not authorized as admin.')
    }
  },
)
