import React from 'react'
import { Helmet } from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'

interface MetaPropertyTag {
  property: string
  content: string
}

interface MetaNameTag {
  name: string
  content: string
}

export interface SEOProps {
  title: string
  description?: string
  lang?: string
  meta?: [MetaPropertyTag | MetaNameTag]
}

type QueryProps = {
  site: {
    siteMetadata: {
      title: string
      description: string
      author: string
    }
  }
}

const SEO_QUERY = graphql`
  query {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`

export type MetaTag = MetaPropertyTag | MetaNameTag

export default function SEO({
  description,
  lang,
  meta,
  title,
}: SEOProps) {
  const { site } = useStaticQuery<QueryProps>(SEO_QUERY)

  const metaDescription = description || site.siteMetadata.description
  const metaTags = meta || []

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        ...metaTags,
      ]}
    />
  )
}

SEO.defaultProps = {
  lang: 'en',
}
