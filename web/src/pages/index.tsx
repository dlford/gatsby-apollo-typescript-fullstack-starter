import React from 'react'
import { graphql } from 'gatsby'

import Layout from '~/components/layout'
import SEO from '~/components/seo'
import ReadMe from '~/components/read-me'

export interface IndexPageProps {
  location: Location
}

interface QueryProps extends IndexPageProps {
  data: {
    site: {
      siteMetadata: {
        title: string
      }
    }
  }
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

const IndexPage = ({ data, location }: QueryProps) => {
  const title = data.site.siteMetadata.title

  return (
    <Layout location={location}>
      <SEO title='Home' />
      <article>
        <ReadMe title={title} />
      </article>
    </Layout>
  )
}

export default IndexPage
