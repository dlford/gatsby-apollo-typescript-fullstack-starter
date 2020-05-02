import React from 'react'

import SEO from '~/components/seo'
import Layout from '~/components/layout'
import Article from '~/components/article'
import Dashboard from '~/components/dashboard'

const isLoggedIn = false

export interface DashboardPageProps {
  location: Location
}

const DashboardPage = ({ location }: DashboardPageProps) => {
  if (!isLoggedIn) {
    return (
      <Layout location={location}>
        <SEO title='Sign In' />
        <Article>
          <h1>Sign In</h1>
          <p>Please sign in to continue</p>
        </Article>
      </Layout>
    )
  }

  return <Dashboard location={location} />
}

export default DashboardPage
