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
    sessions: [Session!]
  }

  extend type Mutation {
    deleteSession(id: ID!): Boolean!
  }

  extend type Subscription {
    sessionCreated: SessionCreated!
    sessionUpdated: SessionUpdated!
    sessionDeleted: SessionDeleted!
  }

  type Session {
    id: ID!
    detail: String
  }

  type SessionCreated {
    session: Session!
  }

  type SessionUpdated {
    session: Session!
  }

  type SessionDeleted {
    session: Session!
  }
`

export default sessionSchema
