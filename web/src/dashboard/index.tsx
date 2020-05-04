import React, { useContext } from 'react'
import { Router } from '@reach/router'

import { UserContext } from '~/context/user'
import Layout from '~/components/layout'
import SignIn from '~/dashboard/pages/sign-in'
import Home from '~/dashboard/pages/home'
import Loader from '~/components/loader'

export interface DashboardComponentProps {
  location: Location
}

const App = ({ location }: DashboardComponentProps) => {
  const { user } = useContext(UserContext)

  if (user?.isValidatingToken)
    return (
      <Layout location={location}>
        <Loader />
      </Layout>
    )

  if (!user?.id)
    return (
      <Layout location={location}>
        <SignIn />
      </Layout>
    )

  return (
    <Layout location={location}>
      <Router basepath='/dashboard'>
        <Home path='/' />
      </Router>
    </Layout>
  )
}

export default App
