import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { navigate } from 'gatsby'

const isLoggedIn = false

export interface PrivateRouteProps {
  Component: React.FC<RouteComponentProps>
  location: Location
  path: string
}

const PrivateRoute = ({
  location,
  path,
  Component,
}: PrivateRouteProps) => {
  if (!isLoggedIn && location.pathname !== '/app/login') {
    // TODO : rewrite history
    navigate('/app/login')
    return null
  }

  return <Component path={path} />
}

export default PrivateRoute
