import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { split } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { createUploadLink } from 'apollo-upload-client'
import { getMainDefinition } from 'apollo-utilities'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { WebSocketLink } from 'apollo-link-ws'

const useApollo = (token: string | void) => {
  interface LinkDefinition {
    kind: string
    operation?: string
  }

  const apiUrl =
    process.env.GATSBY_API_URL || 'http://localhost:3000/graphql'
  const wsUrl =
    process.env.GATSBY_WS_URL || apiUrl.replace(/^http/, 'ws')

  const uploadLink = createUploadLink({
    uri: apiUrl,
    credentials: 'include', // TODO
  })

  const subscriptionClient = new SubscriptionClient(wsUrl, {
    reconnect: true,
    connectionParams: () => {
      return { token }
    },
  })

  const wsLink = new WebSocketLink(subscriptionClient)

  let link = uploadLink
  link = split(
    ({ query }) => {
      const { kind, operation }: LinkDefinition = getMainDefinition(
        query,
      )
      return (
        kind === 'OperationLinkDefinition' &&
        operation === 'subscription'
      )
    },
    wsLink,
    uploadLink,
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
      link: authLink.concat(link),
      cache: new InMemoryCache(),
    }),
    subscriptionClient,
  }
}

export default useApollo
