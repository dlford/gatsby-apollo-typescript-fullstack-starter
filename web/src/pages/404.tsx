import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

export interface NotFoundPageProps {
  location: Location
}

const NotFoundPage = ({ location }: NotFoundPageProps) => (
  <Layout location={location}>
    <SEO title='404: Not found' />
    <article>
      <h1>NOT FOUND</h1>
      <p>
        You just hit a route that doesn&#39;t exist... the sadness.
      </p>
    </article>
  </Layout>
)

export default NotFoundPage
