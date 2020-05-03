import {
  useApolloClient,
  useMutation,
  useQuery,
} from '@apollo/react-hooks'
import Cookies from 'js-cookie'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import React, { createContext, useEffect, useState } from 'react'

import { subscriptionClient } from '~/lib/apollo-client'

export const UserContext = createContext({})

const USER_QUERY = gql`
  query me {
    me {
      id
      username
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

interface MutationProps {
  email: string
  password: string
}

interface ResponseProps {
  data: {
    signIn: {
      token: string
    }
  }
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const apolloClient = useApolloClient()
  const [
    signIn,
    { error: signInError, loading: signInLoading },
  ] = useMutation<MutationProps, ResponseProps>(SIGNIN_MUTATION)

  const authenticate = async (
    email: MutationProps['email'],
    password: MutationProps['password'],
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      signIn({
        variables: { email, password },
      })
        .then(async (result: ResponseProps) => {
          if (!result.data.signIn.token) {
            reject('Authentication error, please try again later.')
          }
          resolve(result.data.signIn.token)
        })
        .catch(() => {
          return
        })
    })
  }

  const {
    data,
    loading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useQuery(USER_QUERY)

  if (userError) {
    Cookies.remove('token', { path: '/' })
  }

  const nullUser = {
    id: null,
    username: null,
    email: null,
    role: null,
  }

  const [user, setUser] = useState({
    ...nullUser,
    isValidatingToken: true,

    signIn: (
      email: MutationProps['email'],
      password: MutationProps['password'],
    ) => {
      return authenticate(email, password)
        .then((token: string) => {
          Cookies.set('token', token, {
            path: '/',
            expires: 30 * 24 * 60 * 60, // 30 days
          })
          apolloClient.cache.reset()
          refetchUser()
          return null
        })
        .catch((error) => {
          return error
        })
    },

    signOut: () => {
      Cookies.remove('token', { path: '/' })
      refetchUser()
      subscriptionClient.close(false, false)
      apolloClient.cache.reset()
    },
  })

  useEffect(() => {
    if (!userLoading) {
      if (data && data.me && !user.id) {
        setUser((prev) => ({
          ...prev,
          ...data.me,
        }))
      }
      if ((!data || !data.me) && user.id) {
        setUser((prev) => ({
          ...prev,
          ...nullUser,
        }))
      }

      // This prop prevents a flash of the email screen because
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
