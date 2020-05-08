import { combineResolvers } from 'graphql-resolvers'

import { isAuthenticated } from './authorization'
import { SessionDocument } from '../models/session'
import { ContextProps } from '../app'

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
        console.log(sessions)
        return sessions.map((session) => session.ip)
      },
    ),
  },
}
