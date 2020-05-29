import { ApolloError } from 'apollo-client'
import { Action } from 'redux'

enum UserRole {
  user = 'USER',
  admin = 'ADMIN',
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
}

type ReducerProps = {
  state: UserProps
  action: Action
}

const defaultState = {
  user: {
    signUp() {
      return
    },
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
  signUpError: undefined,
  signUpLoading: undefined,
  signInError: undefined,
  signInLoading: undefined,
}

export default function ({
  state = defaultState,
  action,
}: ReducerProps) {
  console.log(state)
  console.log(action)
}
