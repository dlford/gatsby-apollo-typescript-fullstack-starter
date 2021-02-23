import { createUploadLink } from 'apollo-upload-client'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { setContext } from '@apollo/client/link/context'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import {
  ApolloClient,
  split,
  createHttpLink,
  InMemoryCache,
  ApolloLink,
} from '@apollo/client'

interface LinkDefinition {
  kind: string
  operation?: string
}

export default function useApollo(token: string | void) {
  const apiUrl =
    process.env.GATSBY_API_URL || 'http://localhost:3000/graphql'
  const wsUrl =
    process.env.GATSBY_WS_URL || apiUrl.replace(/^http/, 'ws')

  const httpLink = createHttpLink({
    uri: apiUrl,
    credentials: process.env.API_CREDENTIALS || 'include',
  })

  const uploadLink = createUploadLink({
    uri: apiUrl,
    credentials: process.env.API_CREDENTIALS || 'include',
  })

  const subscriptionClient = new SubscriptionClient(wsUrl, {
    lazy: true,
    reconnect: true,
    connectionParams: () => ({
      token,
    }),
  })

  const wsLink = new WebSocketLink(subscriptionClient)

  const requestLink = split(
    ({ query }) => {
      const { kind, operation }: LinkDefinition = getMainDefinition(
        query,
      )
      return (
        kind === 'OperationDefinition' && operation === 'subscription'
      )
    },
    wsLink,
    httpLink,
  )

  const terminalLink = split(
    ({ variables }): boolean => {
      return Object.values(variables).some(
        (value) =>
          (typeof File !== 'undefined' && value instanceof File) ||
          (typeof Blob !== 'undefined' && value instanceof Blob),
      )
    },
    uploadLink,
    requestLink,
  )

  const authLink = setContext((_request, { headers }) => {
    return token
      ? {
          headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
          },
        }
      : {}
  })

  return {
    client: new ApolloClient({
      link: authLink.concat(terminalLink as ApolloLink),
      cache: new InMemoryCache(),
    }),
    subscriptionClient,
  }
}
