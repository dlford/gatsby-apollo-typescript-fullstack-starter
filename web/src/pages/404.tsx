import React from 'react'

import SEO from '~/components/seo'
import NotFoundComponent from '~/components/not-found'
import Layout from '~/components/layout'

export interface NotFoundPageProps {
  location: Location
}

const NotFoundPage = ({ location }: NotFoundPageProps) => (
  <Layout location={location}>
    <SEO title='404: Not found' />
    <NotFoundComponent />
  </Layout>
)

export default NotFoundPage
