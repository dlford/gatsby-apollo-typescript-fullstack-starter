import { useApolloClient, useMutation } from '@apollo/react-hooks'
import { ApolloError } from 'apollo-client'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import React, { createContext, useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'

import useApollo from '~/lib/apollo-client'

export interface UserProps {
  user: {
    signIn(credentials: UserCredentialProps): void
    signOut(): void
    id: string | void
    email: string | void
    role: UserRole | void
    exp: number | void
    iat: number | void
  }
  authenticating: boolean
  signInError: ApolloError | void
  signInLoading: boolean | void
}

export const UserContext = createContext<UserProps>({
  user: {
    signIn() {
      return
    },
    signOut() {
      return
    },
    id: undefined,
    email: undefined,
    role: undefined,
    exp: undefined,
    iat: undefined,
  },
  authenticating: true,
  signInError: undefined,
  signInLoading: undefined,
})

export interface UserProviderProps {
  children: JSX.Element | JSX.Element[]
  token: string | void
  setToken(arg0: string | void): void
}

enum UserRole {
  user = 'USER',
  admin = 'ADMIN',
}

type UserCredentialProps = {
  email: string
  password: string
}

type SignInMutationProps = {
  signIn: {
    token: string
  }
}

type RefreshTokenProps = {
  refreshToken: string
}

type TokenProps = {
  id: string | void
  email: string | void
  role: UserRole | void
  exp: number | void
  iat: number | void
}

const nullToken = {
  id: undefined,
  email: undefined,
  role: undefined,
  exp: undefined,
  iat: undefined,
}

const SIGNIN_MUTATION = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
    }
  }
`

const REFRESH_TOKEN_MUTATION = gql`
  mutation {
    refreshToken
  }
`

export const UserProvider = ({
  children,
  token,
  setToken,
}: UserProviderProps) => {
  const apolloClient = useApolloClient()
  const { subscriptionClient } = useApollo(token)

  const [me, setMe] = useState(nullToken as TokenProps)
  const [authenticating, setAuthenticating] = useState(true)

  const checkToken = async (): Promise<TokenProps> => {
    if (token) {
      const contents = (await jwt.decode(token)) as TokenProps
      if (contents.id) {
        if (
          (contents.exp as number) - (contents.iat as number) <=
          0
        ) {
          setToken(undefined)
          return nullToken
        }
        return contents
      }
    }
    return nullToken
  }

  const [
    signIn,
    { loading: signInLoading, error: signInError },
  ] = useMutation(SIGNIN_MUTATION, {
    onCompleted: async (data: SignInMutationProps) => {
      const { token: newToken } = data.signIn
      setToken(newToken)
      apolloClient.cache.reset()
      checkToken().then((data) => {
        setMe(data)
      })
    },
  })

  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN_MUTATION, {
    onCompleted: async ({ refreshToken }: RefreshTokenProps) => {
      if (refreshToken) {
        setToken(refreshToken)
        setTimeout(() => {
          refreshTokenMutation()
        }, 1000 * 60 * 14) // 14 minutes
      } else {
        setAuthenticating(false)
      }
    },
  })

  const [user, setUser] = useState({
    ...me,

    signIn: (credentials: UserCredentialProps): void => {
      signIn({ variables: credentials })
    },

    signOut: (): void => {
      setToken(undefined)
      setMe(nullToken)
      subscriptionClient && subscriptionClient.close(false, false)
      apolloClient.cache.reset()
    },
  })

  useEffect(() => {
    if (token) {
      checkToken()
        .then((data) => setMe(data))
        .then(() => setAuthenticating(false))
    } else {
      refreshTokenMutation()
    }
  }, [token, setMe, setAuthenticating])

  useEffect(() => {
    setUser((prev) => ({
      ...prev,
      ...me,
    }))
  }, [me, setUser])

  return (
    <UserContext.Provider
      value={{ user, authenticating, signInError, signInLoading }}
    >
      {children}
    </UserContext.Provider>
  )
}

UserProvider.propTypes = {
  children: PropTypes.element.isRequired,
}
