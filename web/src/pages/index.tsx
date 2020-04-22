import React from 'react'
import { graphql } from 'gatsby'

import Layout from '~/components/layout'
import SEO from '~/components/seo'
import ReadMe from '~/components/read-me'

export interface IndexPageProps {
  data: {
    site: {
      siteMetadata: {
        title: string
      }
    }
  }
}

const IndexPage: React.FC<IndexPageProps> = ({ data }) => {
  const title: string = data.site.siteMetadata.title

  return (
    <Layout>
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
