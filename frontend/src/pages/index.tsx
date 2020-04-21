import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

const IndexPage: React.FC = () => (
  <Layout>
    <SEO title='Home' />
    <article>
      <h1>Hi people</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
    </article>
  </Layout>
)

export default IndexPage
