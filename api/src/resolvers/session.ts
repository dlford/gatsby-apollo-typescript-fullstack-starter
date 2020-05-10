/**
 * TODO :
 * - Account for other types of devices in sessionstring
 * @packageDocumentation
 */

import { combineResolvers } from 'graphql-resolvers'
import * as moment from 'moment'
import { withFilter } from 'apollo-server'

import { isAuthenticated } from './authorization'
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
  Subscription: {
    sessionCreated: {
      subscribe: combineResolvers(
        isAuthenticated,
        withFilter(
          () => pubsub.asyncIterator(EVENTS.SESSION.CREATED),
          ({ sessionCreated }, _args, { me }) => {
            return sessionCreated.session.userId.toString() === me.id
          },
        ),
      ),
    },
    sessionUpdated: {
      subscribe: combineResolvers(
        isAuthenticated,
        withFilter(
          () => pubsub.asyncIterator(EVENTS.SESSION.UPDATED),
          ({ sessionUpdated }, _args, { me }) => {
            return sessionUpdated.session.userId.toString() === me.id
          },
        ),
      ),
    },
    sessionDeleted: {
      subscribe: combineResolvers(
        isAuthenticated,
        withFilter(
          () => pubsub.asyncIterator(EVENTS.SESSION.DELETED),
          ({ sessionDeleted }, _args, { me }) => {
            return sessionDeleted.userId.toString() === me.id
          },
        ),
      ),
    },
  },
}
