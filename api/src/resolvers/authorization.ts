/**
 * Helper functions for GraphQL resolvers, to be used with `combineResolvers`.
 *
 * @packageDocumentation
 */

import { ForbiddenError, UserInputError } from 'apollo-server'
import { combineResolvers, skip } from 'graphql-resolvers'

import { ContextProps } from '../app'
import { UserRole } from '../models/user'

/**
 * Reject access to unauthenticated users.
 */

export const isAuthenticated = (
  _parent,
  _args,
  { me }: ContextProps,
): ForbiddenError | void =>
  me ? skip : new ForbiddenError('Not authenticated as user')

/**
 * Reject access to unauthenticated and non-admin users.
 */

export const isAdmin = combineResolvers(
  isAuthenticated,
  (
    _parent,
    _args,
    { me: { role } }: ContextProps,
  ): ForbiddenError | void => {
    switch (role) {
      case UserRole.admin:
        return skip
        break
      default:
        return new ForbiddenError('Not authenticated as admin')
    }
  },
)

/**
 * Restrict access to owner of a given Session
 */

export const isSessionOwner = combineResolvers(
  isAuthenticated,
  async (_parent, { id }, { me, models }: ContextProps) => {
    const session = await models.Session.findById(id)

    if (!session) throw new UserInputError('Could not find session')

    if (me.id !== session.userId)
      throw new ForbiddenError('Not authenticated as session owner')

    return skip
  },
)
