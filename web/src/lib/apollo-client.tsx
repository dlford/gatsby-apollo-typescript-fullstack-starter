import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { split } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { createUploadLink } from 'apollo-upload-client'
import { createHttpLink } from 'apollo-link-http'
import { getMainDefinition } from 'apollo-utilities'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { WebSocketLink } from 'apollo-link-ws'

interface LinkDefinition {
  kind: string
  operation?: string
}

const useApollo = (token: string | void) => {
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

  const authLink = setContext((request, { headers }) => {
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
      link: authLink.concat(terminalLink),
      cache: new InMemoryCache(),
    }),
    subscriptionClient,
  }
}

export default useApollo
