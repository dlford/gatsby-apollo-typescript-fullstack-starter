/**
 * Common export point for GraphQL Schema
 *
 * @packageDocumentation
 */

import { gql } from 'apollo-server-express'

import userSchema from './user'
import sessionSchema from './session'
import totpSchema from './totp'

/**
 * Dummy types
 */

const baseSchema = gql`
  scalar Date
  scalar EmailAddress

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

const schema = [baseSchema, userSchema, sessionSchema, totpSchema]
export default schema
