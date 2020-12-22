/**
 * TODO
 * Debug flash of 'loading' on sessions page when token is refreshed
 * Debug eternal loader when session is removed from DB
 * @packageDocumentation
 */

import { useApolloClient, useMutation } from '@apollo/react-hooks'
import { ApolloError } from 'apollo-client'
import { navigate } from 'gatsby'
import gql from 'graphql-tag'
import React, {
  createContext,
  useEffect,
  useState,
  useContext,
} from 'react'
import jwt from 'jsonwebtoken'

import useApollo from '~/lib/apollo-client'

export interface UserProviderProps {
  children: JSX.Element | JSX.Element[]
  token: string | void
  setToken(arg0: string | void): void
}

enum UserRole {
  user = 'USER',
  admin = 'ADMIN',
}

type TotpCredentialProps = {
  token?: string
  recoveryCode?: string
  totpSignInToken: string
}

type UserCredentialProps = {
  email: string
  password: string
}

type SignUpMutationProps = {
  signUp: {
    token: string
  }
}

type SignInMutationProps = {
  signIn: {
    token: string
    totpIntercept: boolean
  }
}

type TotpSignInMutationProps = {
  totpSignIn: {
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

type SignOutArgs = {
  allDevices: boolean
}

export interface UserProps {
  user: {
    signUp: (credentials: UserCredentialProps) => void
    signIn: (credentials: UserCredentialProps) => void
    totpSignIn: (totpCredentials: TotpCredentialProps) => void
    signOut: (arg0?: SignOutArgs) => void
    id: string | void
    email: string | void
    role: UserRole | void
    exp: number | void
    iat: number | void
  }
  authenticating: boolean
  signUpError: ApolloError | void
  signUpLoading: boolean | void
  signInError: ApolloError | void
  signInLoading: boolean | void
  totpEnabled: boolean
  totpSignInToken: string
  totpSignInError: ApolloError | void
  totpSignInLoading: boolean | void
}

const nullToken = {
  id: undefined,
  email: undefined,
  role: undefined,
  exp: undefined,
  iat: undefined,
}

export const UserContext = createContext<UserProps>({
  user: {
    signUp() {
      return
    },
    signIn() {
      return
    },
    totpSignIn() {
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
  signUpError: undefined,
  signUpLoading: undefined,
  signInError: undefined,
  signInLoading: undefined,
  totpEnabled: false,
  totpSignInToken: '',
  totpSignInError: undefined,
  totpSignInLoading: undefined,
})

const SIGNUP_MUTATION = gql`
  mutation signUp($email: EmailAddress!, $password: String!) {
    signUp(email: $email, password: $password) {
      token
    }
  }
`

const SIGNIN_MUTATION = gql`
  mutation signIn($email: EmailAddress!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
      totpIntercept
    }
  }
`

const TOTP_SIGNIN_MUTATION = gql`
  mutation totpSignIn(
    $token: String
    $recoveryCode: String
    $totpSignInToken: String!
  ) {
    totpSignIn(
      token: $token
      recoveryCode: $recoveryCode
      totpSignInToken: $totpSignInToken
    ) {
      token
    }
  }
`

const SIGN_OUT_MUTATION = gql`
  mutation signOut($allDevices: Boolean) {
    signOut(allDevices: $allDevices)
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

  const [me, setMe] = useState<TokenProps>(nullToken)
  const [totpSignInToken, setTotpSignInToken] = useState<string>('')
  const [totpEnabled, setTotpEnabled] = useState<boolean>(false)
  const [authenticating, setAuthenticating] = useState<boolean>(true)

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
    signUpMutation,
    { loading: signUpLoading, error: signUpError },
  ] = useMutation(SIGNUP_MUTATION, {
    onCompleted: async (data: SignUpMutationProps): Promise<void> => {
      const { token: newToken } = data.signUp
      setToken(newToken)
      apolloClient.cache.reset()
      checkToken().then((data) => {
        setMe(data)
        navigate('/app', { replace: true })
      })
    },
  })

  const [
    signInMutation,
    { loading: signInLoading, error: signInError },
  ] = useMutation(SIGNIN_MUTATION, {
    onCompleted: async (data: SignInMutationProps): Promise<void> => {
      const { token: newToken, totpIntercept } = data.signIn
      if (totpIntercept) {
        setTotpSignInToken(newToken)
        setTotpEnabled(true)
      } else {
        setToken(newToken)
        apolloClient.cache.reset()
        checkToken().then((data) => {
          setMe(data)
        })
      }
    },
  })

  const [
    totpSignInMutation,
    { loading: totpSignInLoading, error: totpSignInError },
  ] = useMutation(TOTP_SIGNIN_MUTATION, {
    onCompleted: async (
      data: TotpSignInMutationProps,
    ): Promise<void> => {
      const { token: newToken } = data.totpSignIn
      setToken(newToken)
      apolloClient.cache.reset()
      checkToken().then((data) => {
        setMe(data)
        setTotpSignInToken('')
        setTotpEnabled(false)
      })
    },
  })

  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN_MUTATION, {
    onCompleted: async ({
      refreshToken,
    }: RefreshTokenProps): Promise<void> => {
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

  const [signOutMutation] = useMutation(SIGN_OUT_MUTATION, {
    onCompleted: async (): Promise<void> => {
      setToken(undefined)
      setMe(nullToken)
      subscriptionClient && subscriptionClient.close(false, false)
      apolloClient.cache.reset()
      setAuthenticating(false)
    },
  })

  const [user, setUser] = useState({
    ...me,

    signUp: process.env.DISABLE_SIGNUP
      ? () => {
          return
        }
      : (credentials: UserCredentialProps): void => {
          signUpMutation({ variables: credentials }).catch(() => {
            return
          })
        },

    signIn: (credentials: UserCredentialProps): void => {
      signInMutation({ variables: credentials }).catch(() => {
        return
      })
    },

    totpSignIn: (totpCredentials: TotpCredentialProps): void => {
      totpSignInMutation({ variables: totpCredentials }).catch(
        (err) => {
          // TODO : Count failures and require signing in again
          // If session is expired, go back to the login screen
          if (err.message.includes('expired')) {
            setTotpEnabled(false)
            setTotpSignInToken('')
          }
        },
      )
    },

    signOut: (
      { allDevices }: SignOutArgs = { allDevices: false },
    ): void => {
      setAuthenticating(true)
      signOutMutation({
        variables: { allDevices: allDevices },
      }).catch(() => {
        return
      })
    },
  })

  useEffect(() => {
    if (token) {
      checkToken()
        .then((data) => setMe(data))
        .then(() => setAuthenticating(false))
    } else {
      refreshTokenMutation().catch(() => setAuthenticating(false))
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
      value={{
        user,
        authenticating,
        signInError,
        signInLoading,
        totpEnabled,
        totpSignInToken,
        totpSignInError,
        totpSignInLoading,
        signUpError,
        signUpLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

const useUser = () => {
  const {
    user,
    authenticating,
    signInError,
    signInLoading,
    totpEnabled,
    totpSignInToken,
    totpSignInError,
    totpSignInLoading,
    signUpError,
    signUpLoading,
  } = useContext(UserContext)

  return {
    user,
    authenticating,
    signInError,
    signInLoading,
    totpEnabled,
    totpSignInToken,
    totpSignInError,
    totpSignInLoading,
    signUpError,
    signUpLoading,
  }
}

export default useUser
