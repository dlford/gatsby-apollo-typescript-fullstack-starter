/**
 * TODO :
 * - Account for other types of devices in sessionstring
 * @packageDocumentation
 */

import { combineResolvers } from 'graphql-resolvers'
import * as moment from 'moment'
import { withFilter, UserInputError } from 'apollo-server'

import { isAuthenticated, isSessionOwner } from './authorization'
import { SessionDocument } from '../models/session'
import { ContextProps } from '../app'
import pubsub, { EVENTS } from '../subscription'

/**
 * Parses useragent details into a user-friendly string
 */

export const generateSessionString = (
  session: SessionDocument,
): string => {
  const browser = session.useragent.browser
  const os = session.useragent.os

  if (browser === 'unknown' || os === 'unknown') {
    return `${session.useragent.source} at ${session.ip} (${moment(
      new Date(session.iat * 1000),
    ).format('MMMM Do YYYY, h:mm:ss a')})`
  }

  return `${session.useragent.browser} on ${
    session.useragent.os
  } at ${session.ip} (${moment(new Date(session.iat * 1000)).format(
    'MMMM Do YYYY, h:mm:ss a',
  )})`
}

export interface UserSession {
  id: string
  detail: string
}

export default {
  Query: {
    sessions: combineResolvers(
      isAuthenticated,
      async (
        _parent,
        _args,
        { models, me }: ContextProps,
      ): Promise<UserSession[]> => {
        const sessions: SessionDocument[] = await models.Session.find(
          { userId: me.id },
          {},
          { sort: { iat: -1 } },
        )

        return sessions.map((sessionDoc) => ({
          id: sessionDoc.id,
          detail: generateSessionString(sessionDoc),
        }))
      },
    ),
  },

  Mutation: {
    deleteSession: combineResolvers(
      isSessionOwner,
      async (
        _parent,
        { id },
        { models }: ContextProps,
      ): Promise<boolean> => {
        const session = await models.Session.findById(id)

        if (!session)
          throw new UserInputError('Could not find session')

        pubsub.publish(EVENTS.SESSION.DELETED, {
          sessionDeleted: {
            session: {
              id: session.id,
            },
          },
          userId: session.userId,
        })

        await session.remove()

        return true
      },
    ),
  },

  Subscription: {
    sessionCreated: {
      subscribe: combineResolvers(
        isAuthenticated,
        withFilter(
          () => pubsub.asyncIterator(EVENTS.SESSION.CREATED),
          ({ userId }, _args, { me }) => {
            return userId === me.id
          },
        ),
      ),
    },

    sessionUpdated: {
      subscribe: combineResolvers(
        isAuthenticated,
        withFilter(
          () => pubsub.asyncIterator(EVENTS.SESSION.UPDATED),
          ({ userId }, _args, { me }) => {
            return userId === me.id
          },
        ),
      ),
    },

    sessionDeleted: {
      subscribe: combineResolvers(
        isAuthenticated,
        withFilter(
          () => pubsub.asyncIterator(EVENTS.SESSION.DELETED),
          ({ userId }, _args, { me }) => {
            return userId === me.id
          },
        ),
      ),
    },
  },
}
