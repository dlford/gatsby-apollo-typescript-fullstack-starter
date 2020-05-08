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
`

export default sessionSchema
