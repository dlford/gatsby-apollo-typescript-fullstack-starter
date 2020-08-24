/**
 * Common export point for GraphQL resolvers.
 *
 * @packageDocumentation
 */

import { GraphQLDateTime } from 'graphql-iso-date'

import userResolvers from './user'
import sessionResolvers from './session'
import { GraphQLEmailAddress } from '../scalars/email'

const customScalarResolver = {
  Date: GraphQLDateTime,
  EmailAddress: GraphQLEmailAddress,
}

const resolvers = [
  customScalarResolver,
  userResolvers,
  sessionResolvers,
]
export default resolvers
