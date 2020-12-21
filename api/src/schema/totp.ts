/**
 *
 * ## TOTP Schema
 *
 * ### Mutations
 *
 * ```graphql
 * setupTotp(): GeneratedTotp!
 * enableTotp(token: String!): EnabledTotp!
 * validateTotp(token: String!): Boolean!
 * disableTotp(password: String!): Boolean!
 * validateRecoveryCode(code: String!): Boolean!
 * ```
 *
 * ### Types
 *
 * ```graphql
 *
 * GeneratedTotp {
 *   qr: String!
 *   base32: String!
 * }
 *
 * EnabledTotp {
 *   verified: Boolean!
 *   recoveryCodes: String[]
 * }
 *
 * ```
 *
 * @packageDocumentation
 */

import { gql } from 'apollo-server-express'

const totpSchema = gql`
  extend type Mutation {
    setupTotp: GeneratedTotp!
    enableTotp(token: String!): EnabledTotp!
    disableTotp(password: String!): Boolean!
  }

  type GeneratedTotp {
    qr: String!
    base32: String!
  }

  type EnabledTotp {
    verified: Boolean!
    recoveryCodes: [String!]
  }
`

export default totpSchema
