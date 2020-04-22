import React from 'react'
import { graphql } from 'gatsby'

import Layout from '~/components/layout'
import SEO from '~/components/seo'
import ReadMe from '~/components/read-me'

export interface IndexPageProps {
  location: Location
  data: {
    site: {
      siteMetadata: {
        title: string
      }
    }
  }
}

const IndexPage: React.FC<IndexPageProps> = ({ data, location }) => {
  const title: string = data.site.siteMetadata.title

  return (
    <Layout {...{ location }}>
      <SEO title='Home' />
      <article>
        <ReadMe {...{ title }} />
      </article>
    </Layout>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
