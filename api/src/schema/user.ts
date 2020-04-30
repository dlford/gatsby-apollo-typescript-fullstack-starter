/**
 *
 * ## User Schema
 *
 * ```
 * extend type Query {
 *   users: [User!]
 *   user(id: ID!): User
 *   me: User
 * }
 *
 * extend type Mutation {
 *   signUp(email: String!, password: String!): Token!
 *   signIn(email: String!, password: String!): Token!
 *   updateUser(email: String!): User!
 *   deleteUser(id: ID!): Boolean!
 * }
 *
 * type Token {
 *   token: String!
 * }
 *
 * type User {
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
    updateUser(email: String!): User!
    deleteUser(id: ID!): Boolean!
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
