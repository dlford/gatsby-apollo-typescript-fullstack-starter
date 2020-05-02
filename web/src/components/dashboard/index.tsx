import React from 'react'
import { Router, RouteComponentProps } from '@reach/router'
import { ApolloProvider } from 'react-apollo'

import ApolloClient from '~/lib/apollo-client'
import SEO from '~/components/seo'
import Layout from '~/components/layout'
import Article from '~/components/article'

// TODO : fix ws reconnect without token issue

export interface DashboardComponentProps {
  location: Location
}

const DummyComponent: React.ElementType<RouteComponentProps> = () => (
  <Article>
    <SEO title='Home' />
    <h1>Private Route</h1>
    <p>You cannot see this without logging in first.</p>
  </Article>
)

const App = ({ location }: DashboardComponentProps) => {
  return (
    <ApolloProvider client={ApolloClient}>
      <Layout location={location}>
        <Router basepath='/dashboard'>
          <DummyComponent path='/' />
        </Router>
      </Layout>
    </ApolloProvider>
  )
}

export default App
