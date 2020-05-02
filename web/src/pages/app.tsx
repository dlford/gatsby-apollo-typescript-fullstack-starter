import React from 'react'
import { Router } from '@reach/router'
import { ApolloProvider } from 'react-apollo'

import ApolloClient from '~/lib/apollo-client'
import SEO from '~/components/seo'
import Layout from '~/components/layout'
import PrivateRoute from '~/components/private-route'
import Article from '~/components/article'
import SignIn from '~/components/sign-in'

export interface AppPageProps {
  location: Location
}

// TODO : Keep sign in page out of apollo provider

const App = ({ location }: AppPageProps) => {
  return (
    <ApolloProvider client={ApolloClient}>
      <Layout location={location}>
        <Router basepath='/app'>
          <PrivateRoute
            path='/home'
            location={location}
            Component={() => (
              <Article>
                <SEO title='Home' />
                <h1>Private Route</h1>
                <p>You cannot see this without logging in first.</p>
              </Article>
            )}
          />
          <SignIn path='/' />
        </Router>
      </Layout>
    </ApolloProvider>
  )
}

export default App
