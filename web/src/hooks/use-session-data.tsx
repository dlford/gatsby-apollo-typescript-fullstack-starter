import { useEffect } from 'react'
import { gql, useQuery, useMutation } from '@apollo/react-hooks'

export interface QueryProps {
  id: string
  detail: string
  isCurrent: boolean
}

const SESSIONS_QUERY = gql`
  query {
    sessions {
      id
      detail
      isCurrent
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
        isCurrent
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
        isCurrent
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

export default function useSessionData() {
  const {
    subscribeToMore,
    data: sessionData,
    loading: sessionLoading,
    error: sessionError,
  } = useQuery(SESSIONS_QUERY)

  const [
    deleteSession,
    { loading: deleteSessionLoading, error: deleteSessionError },
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

  return {
    sessionData,
    sessionLoading,
    sessionError,
    deleteSession,
    deleteSessionLoading,
    deleteSessionError,
  }
}
