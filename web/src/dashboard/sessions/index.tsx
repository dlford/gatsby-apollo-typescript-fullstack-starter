import React from 'react'
import { RouteComponentProps } from '@reach/router'

import useSessionData, { QueryProps } from './use-session-data'
import SEO from '~/components/seo'
import Article from '~/components/article'
import Loader from '~/components/loader'

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
  // TODO : Label THIS session

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
        <ul>
          {sessionData.sessions.map((session: QueryProps) => (
            <li key={session.id}>
              {session.detail}{' '}
              <a
                role='button'
                tabIndex={0}
                onClick={() =>
                  deleteSession({ variables: { id: session.id } })
                }
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

export default SessionsComponent
