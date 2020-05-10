import React, { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { RouteComponentProps } from '@reach/router'

import SEO from '~/components/seo'
import Article from '~/components/article'

const SESSIONS_QUERY = gql`
  query {
    sessions {
      id
      detail
    }
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

  const unsubscribeFromMoreSessions = () => {
    subscribeToMore({
      document: SESSION_CREATED_SUBSCRIPTION,
      updateQuery: () => {
        return
      },
    })
    subscribeToMore({
      document: SESSION_UPDATED_SUBSCRIPTION,
      updateQuery: () => {
        return
      },
    })
    subscribeToMore({
      document: SESSION_DELETED_SUBSCRIPTION,
      updateQuery: () => {
        return
      },
    })
  }

  useEffect(() => {
    subscribeToMoreSessions()
    return unsubscribeFromMoreSessions()
  }, [])

  return (
    <Article>
      <SEO title='Home' />
      <h1>Sessions</h1>
      {loading && 'loading...'}
      {error && (error.message || error)}
      {data && (
        <ul>
          {data.sessions.map((session: QueryProps) => (
            <li key={session.id}>{session.detail}</li>
          ))}
        </ul>
      )}
    </Article>
  )
}

export default SessionsComponent
