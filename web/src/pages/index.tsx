import React from 'react'
import { graphql, Link } from 'gatsby'

import Layout from '~/components/layout'
import SEO from '~/components/seo'
import Article from '~/components/article'

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
      <SEO title='Welcome' />
      <Article>
        <Link to='/app'>Go to the dashboard!</Link>
        <h1>{title}</h1>
        <p>
          Hey! You&apos;ve found my {title}, I hope you do something
          cool with it!
        </p>
        <h2>Features</h2>
        <ul>
          <li>
            Don&apos;t use <code>React.FC</code> (See why{' '}
            <a
              href='https://github.com/facebook/create-react-app/pull/8177'
              target='_blank'
              rel='noopener noreferrer'
            >
              here
            </a>
            )
          </li>
          <li>Storybook</li>
          <li>Jest</li>
          <li>Prettier / ESLint</li>
          <li>Emotion</li>
          <li>Tailwind + Twin.Macro</li>
        </ul>
      </Article>
    </Layout>
  )
}

export default IndexPage
