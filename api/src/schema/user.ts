/**
 *
 * TODO : Break out updateUser into individual actions
 * TODO : Add password recovery
 *
 * ## User Schema
 *
 * ### Queries
 *
 * ```graphql
 * users: [User!]
 * user(id: ID!): User
 * me: User
 * ```
 *
 * ### Mutations
 *
 * ```graphql
 * signUp(email: EmailAddress!, password: String!): Token!
 * signIn(email: EmailAddress!, password: String!): Token!
 * signOut(allDevices: Boolean): Boolean!
 * setupTotp(): GeneratedTotp!
 * enableTotp(token: String!): EnabledTotp!
 * validateTotp(token: String!): Boolean!
 * disableTotp(password: String!): Boolean!
 * validateRecoveryCode(code: String!): Boolean!
 * updateUser(email: EmailAddress!): User!
 * deleteUser(id: ID!): Boolean!
 * refreshToken: String
 * ```
 *
 * ### Types
 *
 * ```graphql
 * Token {
 *   token: String!
 * }
 *
 * User {
 *   id: ID!
 *   email: String!
 *   role: UserRole!
 * }
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
 * enum UserRole {
 *   ADMIN
 *   USER
 * }
 * ```
 *
 * @packageDocumentation
 */

import { gql } from 'apollo-server-express'

const userSchema = gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    signUp(email: EmailAddress!, password: String!): Token!
    signIn(email: EmailAddress!, password: String!): Token!
    signOut(allDevices: Boolean): Boolean!
    setupTotp(): GeneratedTotp!
    enableTotp(token: String!): EnabledTotp!
    validateTotp(token: String!): Boolean!
    disableTotp(password: String!): Boolean!
    validateRecoveryCode(code: String!): Boolean!
    updateUser(email: EmailAddress!): User!
    deleteUser(id: ID!): Boolean!
    refreshToken: String!
  }

  type Token {
    token: String!
  }

  type User {
    id: ID!
    email: EmailAddress!
    role: UserRole!
    totpEnabled: Boolean!
  }

  type GeneratedTotp {
    qr: String!
    base32: String!
  }

  type EnabledTotp {
    verified: Boolean!
    recoveryCodes: String[]
  }

  enum UserRole {
    ADMIN
    USER
  }
`

export default userSchema
