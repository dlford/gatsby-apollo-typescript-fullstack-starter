/**
 * Common export point for GraphQL resolvers.
 *
 * @packageDocumentation
 */

import { GraphQLDateTime } from 'graphql-iso-date'

import userResolvers from './user'

const customScalarResolver = {
  Date: GraphQLDateTime,
}

const resolvers = [customScalarResolver, userResolvers]
export default resolvers
