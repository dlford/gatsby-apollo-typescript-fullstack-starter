import React, { ElementType } from 'react'
import { RouteComponentProps } from '@reach/router'
import { navigate } from 'gatsby'

const isLoggedIn = false

export interface PrivateRouteProps {
  Component: ElementType<RouteComponentProps>
  location: Location
  path: string
}

const PrivateRoute = ({
  location,
  path,
  Component,
}: PrivateRouteProps) => {
  if (!isLoggedIn && location.pathname !== '/app') {
    navigate('/app', { replace: true })
    return null
  }

  return <Component path={path} />
}

export default PrivateRoute
