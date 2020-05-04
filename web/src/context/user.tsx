import {
  useApolloClient,
  useMutation,
  useQuery,
} from '@apollo/react-hooks'
import { ApolloError } from 'apollo-client'
import Cookies from 'js-cookie'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import React, { createContext, useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'

import { subscriptionClient } from '~/lib/apollo-client'

export interface UserProps {
  user: {
    isValidatingToken: boolean
    signIn(credentials: UserCredentialProps): void
    signOut(): void
    id: string | void
    email: string | void
    role: UserRole | void
  }
  signInError: ApolloError | void
  signInLoading: boolean | void
}

interface TokenProps {
  email: string
  exp: number
  iat: number
  id: string
  role: UserRole
}

// TODO : Don't query backend to validate token, just read and test expiration

const token = Cookies.get('token')
if (token) {
  const me = jwt.decode(token)
  const isExpired = me.exp < me.iat
  console.log(me)
  console.log(isExpired)
}

export const UserContext = createContext<UserProps>({
  user: {
    isValidatingToken: true,
    signIn() {
      return
    },
    signOut() {
      return
    },
    id: undefined,
    email: undefined,
    role: undefined,
  },
  signInError: undefined,
  signInLoading: undefined,
})

const USER_QUERY = gql`
  query me {
    me {
      id
      email
      role
    }
  }
`

const SIGNIN_MUTATION = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
    }
  }
`

export interface UserProviderProps {
  children: JSX.Element | JSX.Element[]
}

enum UserRole {
  user = 'USER',
  admin = 'ADMIN',
}

type UserCredentialProps = {
  email: string
  password: string
}

type ResponseProps = {
  signIn: {
    token: string
  }
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const apolloClient = useApolloClient()

  const {
    data,
    loading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useQuery(USER_QUERY)

  if (userError) {
    Cookies.remove('token', { path: '/' })
  }

  const [
    signIn,
    { loading: signInLoading, error: signInError },
  ] = useMutation(SIGNIN_MUTATION, {
    onCompleted: (data: ResponseProps) => {
      const { token } = data.signIn
      Cookies.set('token', token, {
        path: '/',
        expires: new Date(new Date().getTime() + 30 * 60 * 1000), // 30 minutes
      })
      apolloClient.cache.reset()
      refetchUser()
    },
  })

  const nullUser = {
    id: undefined,
    email: undefined,
    role: undefined,
  }

  const [user, setUser] = useState({
    ...nullUser,
    isValidatingToken: true,

    signIn: (credentials: UserCredentialProps): void => {
      signIn({ variables: credentials })
    },

    signOut: (): void => {
      Cookies.remove('token', { path: '/' })
      refetchUser()
      subscriptionClient.close(false, false)
      apolloClient.cache.reset()
    },
  })

  useEffect(() => {
    if (!userLoading) {
      if (data?.me && !user.id) {
        setUser((prev) => ({
          ...prev,
          ...data.me,
        }))
      }
      if (!data?.me && user.id) {
        setUser((prev) => ({
          ...prev,
          ...nullUser,
        }))
        setUser((prev) => ({
          ...prev,
          isValidatingToken: false,
        }))
      }

      // This prop prevents a flash of the sign in page because
      // userLoading turns false before user props are set in
      // the user context, so isValidatingToken is changed here
      // after the user props are updated.
      if (user.isValidatingToken) {
        setUser((prev) => ({
          ...prev,
          isValidatingToken: false,
        }))
      }
    }
  }, [data, userLoading, user.isValidatingToken, user.id, nullUser])

  return (
    <UserContext.Provider
      value={{ user, signInError, signInLoading }}
    >
      {children}
    </UserContext.Provider>
  )
}

UserProvider.propTypes = {
  children: PropTypes.element.isRequired,
}
