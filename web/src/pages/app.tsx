import { RouteComponentProps } from '@reach/router'
import React, { ElementType } from 'react'
import { Router } from '@reach/router'

import SEO from '~/components/seo'
import Layout from '~/components/layout'
import PrivateRoute from '~/components/private-route'
import Article from '~/components/article'
import NotFound from '~/components/not-found'
import SignIn from '~/components/sign-in'

export interface AppPageProps {
  location: Location
}

const App = ({ location }: AppPageProps) => {
  return (
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
        <DefaultComponent default />
      </Router>
    </Layout>
  )
}

export default App

const DefaultComponent: ElementType<RouteComponentProps> = () => (
  <>
    <SEO title='404: Not found' />
    <NotFound />
  </>
)
