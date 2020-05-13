import React, { useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { RouteComponentProps } from '@reach/router'

import SEO from '~/components/seo'
import Article from '~/components/article'
import Loader from '~/components/loader'

const SESSIONS_QUERY = gql`
  query {
    sessions {
      id
      detail
    }
  }
`

const DELETE_SESSION_MUTATION = gql`
  mutation($id: ID!) {
    deleteSession(id: $id)
  }
`

const SESSION_CREATED_SUBSCRIPTION = gql`
  subscription {
    sessionCreated {
      session {
        id
        detail
      }
    }
  }
`

const SESSION_UPDATED_SUBSCRIPTION = gql`
  subscription {
    sessionUpdated {
      session {
        id
        detail
      }
    }
  }
`

const SESSION_DELETED_SUBSCRIPTION = gql`
  subscription {
    sessionDeleted {
      session {
        id
      }
    }
  }
`

type QueryProps = {
  id: string
  detail?: string
}

type SubscriptionProps = {
  subscriptionData: {
    data: {
      sessionCreated?: {
        session: QueryProps
      }
      sessionUpdated?: {
        session: QueryProps
      }
      sessionDeleted?: {
        session: QueryProps
      }
    }
  }
}

const SessionsComponent: React.ElementType<RouteComponentProps> = () => {
  const { subscribeToMore, data, loading, error } = useQuery(
    SESSIONS_QUERY,
  )

  const [
    deleteSession,
    { loading: deleteLoading, error: deleteError },
  ] = useMutation(DELETE_SESSION_MUTATION)

  const subscribeToMoreSessions = () => {
    subscribeToMore({
      document: SESSION_CREATED_SUBSCRIPTION,
      updateQuery: (
        prev: { sessions: QueryProps[] },
        { subscriptionData }: SubscriptionProps,
      ) => {
        if (!subscriptionData.data) {
          return prev
        }
        const newSessionItem =
          subscriptionData?.data?.sessionCreated?.session
        return Object.assign({}, prev, {
          sessions: [newSessionItem, ...prev.sessions],
        })
      },
    })
    subscribeToMore({
      document: SESSION_UPDATED_SUBSCRIPTION,
      updateQuery: (
        prev: { sessions: QueryProps[] },
        { subscriptionData }: SubscriptionProps,
      ) => {
        if (!subscriptionData.data) {
          return prev
        }
        const updatedSessionItem =
          subscriptionData?.data?.sessionUpdated?.session
        const updatedSessions = prev.sessions.map(
          (session: QueryProps) => {
            if (session.id === updatedSessionItem?.id) {
              return updatedSessionItem
            } else {
              return session
            }
          },
        )
        return Object.assign({}, prev, {
          sessions: updatedSessions,
        })
      },
    })
    subscribeToMore({
      document: SESSION_DELETED_SUBSCRIPTION,
      updateQuery: (
        prev: { sessions: QueryProps[] },
        { subscriptionData }: SubscriptionProps,
      ) => {
        if (!subscriptionData.data) {
          return prev
        }
        const updatedSessions = prev.sessions.filter(
          (session: QueryProps) => {
            return (
              session.id !==
              subscriptionData?.data?.sessionDeleted?.session?.id
            )
          },
        )
        return Object.assign({}, prev, {
          sessions: updatedSessions,
        })
      },
    })
  }

  useEffect(() => {
    subscribeToMoreSessions()
  }, [])

  // TODO : Loader position absolute
  // TODO : ScrollTo on error
  // TODO : Label THIS session

  return (
    <Article>
      <SEO title='Home' />
      {loading || (deleteLoading && <Loader />)}
      {error && <p>{error.message || error}</p>}
      {deleteError && <p>{deleteError.message || deleteError}</p>}
      <h1>Sessions</h1>
      {error && (error.message || error)}
      {data && (
        <ul>
          {data.sessions.map((session: QueryProps) => (
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
