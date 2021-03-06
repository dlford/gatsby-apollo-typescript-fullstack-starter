/**
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
 *   totpIntercept: Boolean!
 * }
 *
 * User {
 *   id: ID!
 *   email: String!
 *   role: UserRole!
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
    totpSignIn(
      token: String
      recoveryCode: String
      totpSignInToken: String!
    ): Token!
    signOut(allDevices: Boolean): Boolean!
    updateUser(email: EmailAddress!): User!
    deleteUser(id: ID!): Boolean!
    refreshToken: String!
    setupTotp: GeneratedTotp!
    enableTotp(token: String!): EnabledTotp!
    disableTotp(password: String!): Boolean!
  }

  type Token {
    token: String!
    totpIntercept: Boolean!
  }

  type User {
    id: ID!
    email: EmailAddress!
    role: UserRole!
    totpEnabled: Boolean!
  }

  enum UserRole {
    ADMIN
    USER
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

export default userSchema
