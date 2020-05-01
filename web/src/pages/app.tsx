import React from 'react'
import { Router } from '@reach/router'

import Layout from '~/components/layout'
import PrivateRoute from '~/components/private-route'
import Article from '~/components/article'

export interface AppPageProps {
  location: Location
}

const App = ({ location }: AppPageProps) => {
  return (
    <Layout location={location}>
      <Router basepath='/app'>
        <PrivateRoute
          path='/profile'
          location={location}
          Component={
            <Article>
              <h1>Private Route</h1>
              <p>You cannot see this without logging in first.</p>
            </Article>
          }
        />
        <Article>
          <p>You need to log in</p>
        </Article>
      </Router>
    </Layout>
  )
}

export default App
