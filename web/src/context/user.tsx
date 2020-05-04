import { useApolloClient, useMutation } from '@apollo/react-hooks'
import { ApolloError } from 'apollo-client'
import Cookies from 'js-cookie'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import React, { createContext, useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'

import { subscriptionClient } from '~/lib/apollo-client'

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
  signInError: undefined,
  signInLoading: undefined,
})

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

const readToken = async (): Promise<TokenProps> => {
  const token = Cookies.get('token')
  if (token) {
    const tokenObj = (await jwt.decode(token)) as TokenProps
    if (tokenObj.id) {
      if ((tokenObj.exp as number) - (tokenObj.iat as number) <= 0) {
        Cookies.remove('token', { path: '/' })
        return nullToken
      }
      return tokenObj
    }
  }
  return nullToken
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const apolloClient = useApolloClient()

  const [me, setMe] = useState(nullToken as TokenProps)

  const [
    signIn,
    { loading: signInLoading, error: signInError },
  ] = useMutation(SIGNIN_MUTATION, {
    onCompleted: async (data: ResponseProps) => {
      const { token } = data.signIn
      Cookies.set('token', token, {
        path: '/',
        expires: new Date(new Date().getTime() + 30 * 60 * 1000), // 30 minutes
      })
      apolloClient.cache.reset()
      readToken().then((data) => {
        setMe(data)
      })
    },
  })

  const [user, setUser] = useState({
    ...me,

    signIn: (credentials: UserCredentialProps): void => {
      signIn({ variables: credentials })
    },

    signOut: (): void => {
      Cookies.remove('token', { path: '/' })
      setMe(nullToken)
      subscriptionClient.close(false, false)
      apolloClient.cache.reset()
    },
  })

  useEffect(() => {
    readToken().then((data) => setMe(data))
  }, [])

  useEffect(() => {
    setUser((prev) => ({
      ...prev,
      ...me,
    }))
  }, [me, nullToken])

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
