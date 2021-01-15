import React from 'react'
import { Link } from 'gatsby'

import useSessionData, { QueryProps } from '~/hooks/use-session-data'
import SEO from '~/components/seo'
import Article from '~/components/article'
import Loader from '~/components/loader'

export default function SessionsComponent() {
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
      <Link to='/app'>Back to Dashboard</Link>
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
    </Article>
  )
}
