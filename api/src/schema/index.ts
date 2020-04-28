import { gql } from 'apollo-server-express'

import userSchema from '~/schema/user'

const baseSchema = gql`
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

export default [baseSchema, userSchema]
