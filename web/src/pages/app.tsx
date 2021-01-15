import React from 'react'
import { Router, RouteComponentProps } from '@reach/router'

import useUser from '~/context/user'
import Layout from '~/components/layout'
import Authenticate from '~/app/authenticate'
import Dashboard from '~/app/dashboard'
import SetupTotp from '~/app/setup-totp'
import DisableTotp from '~/app/disable-totp'
import Sessions from '~/app/sessions'
import Loader from '~/components/loader'

export interface AppPageProps {
  location: Location
}

export interface RouteProps extends RouteComponentProps {
  children: JSX.Element | JSX.Element[]
}

function Route({ children }: RouteProps) {
  return <>{children}</>
}

export default function AppPage({ location }: AppPageProps) {
  const { user, authenticating } = useUser()

  if (authenticating)
    return (
      <Layout location={location}>
        <Loader />
      </Layout>
    )

  if (!user?.id)
    return (
      <Layout location={location}>
        <Authenticate />
      </Layout>
    )

  return (
    <Layout location={location}>
      <Router basepath='/app'>
        <Route path='/'>
          <Dashboard />
        </Route>
        <Route path='/sessions'>
          <Sessions />
        </Route>
        <Route path='/setup-totp'>
          <SetupTotp />
        </Route>
        <Route path='/disable-totp'>
          <DisableTotp />
        </Route>
      </Router>
    </Layout>
  )
}
