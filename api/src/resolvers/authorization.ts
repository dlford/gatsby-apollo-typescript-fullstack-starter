/**
 * Helper functions for GraphQL resolvers, to be used with `combineResolvers`.
 *
 * @packageDocumentation
 */

import { ForbiddenError } from 'apollo-server'
import { combineResolvers, skip } from 'graphql-resolvers'

import { UserRole } from '../models/user'

/**
 * Reject access to unauthenticated users.
 */

export const isAuthenticated = (
  _parent,
  _args,
  { me },
): ForbiddenError | void =>
  me ? skip : new ForbiddenError('Not authenticated as user.')

/**
 * Reject access to unauthenticated and non-admin users.
 */

export const isAdmin = combineResolvers(
  isAuthenticated,
  (_parent, _args, { me: { role } }): ForbiddenError | void => {
    switch (role) {
      case UserRole.admin:
        return skip
        break
      default:
        return new ForbiddenError('Not authenticated as admin.')
    }
  },
)
