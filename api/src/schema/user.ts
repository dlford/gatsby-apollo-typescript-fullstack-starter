/**
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
 * signUp(email: String!, password: String!): Token!
 * signIn(email: String!, password: String!): Token!
 * signOut(allDevices: Boolean): Boolean!
 * updateUser(email: String!): User!
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
    signUp(email: String!, password: String!): Token!
    signIn(email: String!, password: String!): Token!
    signOut(allDevices: Boolean): Boolean!
    updateUser(email: String!): User!
    deleteUser(id: ID!): Boolean!
    refreshToken: String
  }

  type Token {
    token: String!
  }

  type User {
    id: ID!
    email: String!
    role: UserRole!
  }

  enum UserRole {
    ADMIN
    USER
  }
`

export default userSchema
