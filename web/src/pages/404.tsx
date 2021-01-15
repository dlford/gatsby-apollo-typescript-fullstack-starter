import React from 'react'

import SEO from '~/components/seo'
import Article from '~/components/article'
import Layout from '~/components/layout'

export interface NotFoundPageProps {
  location: Location
}

export default function NotFoundPage({
  location,
}: NotFoundPageProps) {
  return (
    <Layout location={location}>
      <SEO title='404: Not found' />
      <Article>
        <h1>NOT FOUND</h1>
        <p>
          You just hit a route that doesn&#39;t exist... the sadness.
        </p>
      </Article>
    </Layout>
  )
}
