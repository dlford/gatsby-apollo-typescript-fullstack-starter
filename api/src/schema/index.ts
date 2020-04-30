/**
 * Common export point for GraphQL Schema
 *
 * @packageDocumentation
 */

import { gql } from 'apollo-server-express'

import userSchema from './user'

/**
 * Dummy types
 */

const baseSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`

const schema = [baseSchema, userSchema]
export default schema
