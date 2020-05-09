/**
 *
 * ## Session Schema TODO
 *
 * ### Queries
 *
 * ```graphql
 * sessions: [User!]
 * ```
 *
 * ### Mutations
 *
 * ```graphql
 * ```
 *
 * ### Types
 *
 * ```graphql
 * }
 *
 * @packageDocumentation
 */

import { gql } from 'apollo-server-express'

const sessionSchema = gql`
  extend type Query {
    sessions: [String!]
  }

  extend type Subscription {
    sessionCreated: SessionCreated
    sessionUpdated: SessionUpdated
    sessionDeleted: SessionDeleted
  }

  type SessionCreated: {
    id: ID!
    detail: String
  }

  type SessionUpdated: {
    id: ID!
    detail: String
  }

  type SessionDeleted: {
    detail: ID!
  }
`

export default sessionSchema
