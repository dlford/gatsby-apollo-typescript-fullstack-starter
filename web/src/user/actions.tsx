import { Dispatch } from 'redux'

import { UserCredentialProps } from './reducer'

export const SIGN_UP = 'SIGN_IN'
export const SIGN_IN = 'SIGN_IN'
export const SIGN_OUT = 'SIGN_OUT'

export const signUp = (credentials: UserCredentialProps) => (
  dispatch: Dispatch,
) => {
  console.log(credentials)
  const user = {}
  return dispatch({
    type: SIGN_UP,
    payload: user,
  })
}

export const signIn = (credentials: UserCredentialProps) => (
  dispatch: Dispatch,
) => {
  console.log(credentials)
  const user = {}
  return dispatch({
    type: SIGN_IN,
    payload: user,
  })
}

export const signOut = () => (dispatch: Dispatch) => {
  const user = {}
  return dispatch({
    type: SIGN_OUT,
    payload: user,
  })
}
