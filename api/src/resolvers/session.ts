/**
 * TODO :
 * - Account for other types of devices in sessionstring
 * @packageDocumentation
 */

import { combineResolvers } from 'graphql-resolvers'
import * as moment from 'moment'

import { isAuthenticated } from './authorization'
import { SessionDocument } from '../models/session'
import { ContextProps } from '../app'

/**
 * Parses useragent details into a user-friendly string
 */

const generateSessionString = (session: SessionDocument): string => {
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

export default {
  Query: {
    sessions: combineResolvers(
      isAuthenticated,
      async (
        _parent,
        _args,
        { models, me }: ContextProps,
      ): Promise<string[]> => {
        const sessions: SessionDocument[] = await models.Session.find(
          { userId: me.id },
        )
        return sessions.map((session) =>
          generateSessionString(session),
        )
      },
    ),
  },
}
