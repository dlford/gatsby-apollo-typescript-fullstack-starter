import React from 'react'
import { RouteComponentProps, Link } from '@reach/router'

import useSessionData, { QueryProps } from '~/hooks/use-session-data'
import SEO from '~/components/seo'
import Article from '~/components/article'
import Loader from '~/components/loader'
import Button from '~/components/button'

const SessionsComponent: React.ElementType<RouteComponentProps> = () => {
  const {
    sessionData,
    sessionLoading,
    sessionError,
    deleteSession,
    deleteSessionLoading,
    deleteSessionError,
  } = useSessionData()

  // TODO : Loader position absolute
  // TODO : ScrollTo on error

  return (
    <Article>
      <SEO title='Home' />
      {sessionLoading || (deleteSessionLoading && <Loader />)}
      {sessionError && <p>{sessionError.message || sessionError}</p>}
      {deleteSessionError && (
        <p>{deleteSessionError.message || deleteSessionError}</p>
      )}
      <h1>Sessions</h1>
      {sessionData && (
        <ul style={{ marginBottom: '2rem' }}>
          {sessionData.sessions.map((session: QueryProps) => (
            <li key={session.id}>
              {session.detail}{' '}
              {session.isCurrent && '[Current Session] '}
              <a
                role='button'
                aria-label='Remove session'
                tabIndex={0}
                onClick={() =>
                  deleteSession({ variables: { id: session.id } })
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    deleteSession({ variables: { id: session.id } })
                  }
                }}
              >
                Remove
              </a>
            </li>
          ))}
        </ul>
      )}
      <Link to='/app'>
        <Button>Back to App Dashboard</Button>
      </Link>
      <div style={{ marginTop: '4rem' }}>
        <Link to='/'>Back to home page</Link>
      </div>
    </Article>
  )
}

export default SessionsComponent
