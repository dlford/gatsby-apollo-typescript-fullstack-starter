import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { RouteComponentProps } from '@reach/router'

import SEO from '~/components/seo'
import Article from '~/components/article'

const SESSIONS_QUERY = gql`
  query {
    sessions
  }
`

const SessionsComponent: React.ElementType<RouteComponentProps> = () => {
  const { loading, error } = useQuery(SESSIONS_QUERY)
  return (
    <Article>
      <SEO title='Home' />
      <h1>Sessions</h1>
      {loading && 'loading...'}
      {error && (error.message || error)}
    </Article>
  )
}

export default SessionsComponent

/*
      {data && (
        <ul>
          {data.sessions.map((session) => (
            <li>{session}</li>
          ))}
        </ul>
      )}
*/
