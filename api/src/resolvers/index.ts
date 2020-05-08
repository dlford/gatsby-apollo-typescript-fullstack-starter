/**
 * Common export point for GraphQL resolvers.
 *
 * @packageDocumentation
 */

import { GraphQLDateTime } from 'graphql-iso-date'

import userResolvers from './user'
import sessionResolvers from './session'

const customScalarResolver = {
  Date: GraphQLDateTime,
}

const resolvers = [
  customScalarResolver,
  userResolvers,
  sessionResolvers,
]
export default resolvers
