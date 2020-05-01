import React from 'react'
import { navigate } from 'gatsby'

const isLoggedIn = true

export interface PrivateRouteProps {
  Component: JSX.Element
  location: Location
  path: string
}

const PrivateRoute = ({ location }: PrivateRouteProps) => {
  if (!isLoggedIn && location.pathname !== '/app/login') {
    navigate('/app/login')
    return null
  }

  return null
  //return <Component path={path} />
}

export default PrivateRoute
