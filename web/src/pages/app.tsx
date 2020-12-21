import React from 'react'
import { Router } from '@reach/router'

import useUser from '~/context/user'
import Layout from '~/components/layout'
import Authenticate from '~/app/authenticate'
import Dashboard from '~/app/dashboard'
import SetupTotp from '~/app/setup-totp'
import Sessions from '~/app/sessions'
import Loader from '~/components/loader'

export interface AppPageProps {
  location: Location
}

const AppPage = ({ location }: AppPageProps) => {
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
        <Dashboard path='/' />
        <Sessions path='/sessions' />
        <SetupTotp path='/setup-totp' />
      </Router>
    </Layout>
  )
}

export default AppPage
