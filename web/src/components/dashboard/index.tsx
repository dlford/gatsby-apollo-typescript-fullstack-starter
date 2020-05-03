import React, { useContext } from 'react'
import { Router } from '@reach/router'

import { UserContext } from '~/context/user'
import Article from '~/components/article'
import Layout from '~/components/layout'
import SignIn from '~/components/dashboard/sign-in'
import Home from '~/components/dashboard/home'

export interface DashboardComponentProps {
  location: Location
}

const App = ({ location }: DashboardComponentProps) => {
  const { user } = useContext(UserContext)

  if (user?.isValidatingToken)
    return (
      <Layout location={location}>
        <Article>
          <p>Loading...</p>
        </Article>
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
