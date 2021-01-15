import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import { renderToString } from 'react-dom/server'
import useApollo from './apollo-client'

import { UserProvider } from '~/context/user'
import useToken, { TokenProvider } from '~/context/token'

interface ReplaceBodyProps {
  bodyComponent: JSX.Element | JSX.Element[]
  replaceBodyHTMLString: any
}

interface ReplaceBodySubProps {
  bodyComponent: JSX.Element | JSX.Element[]
}

export function replaceRenderer({
  bodyComponent,
  replaceBodyHTMLString,
}: ReplaceBodyProps) {
  const ConnectedBody = () => (
    <TokenProvider>
      <SubRoot bodyComponent={bodyComponent} />
    </TokenProvider>
  )

  replaceBodyHTMLString(renderToString(<ConnectedBody />))
}

function SubRoot({ bodyComponent }: ReplaceBodySubProps) {
  const { token, setToken } = useToken()
  const { client } = useApollo(token)
  return (
    <ApolloProvider client={client}>
      <UserProvider token={token} setToken={setToken}>
        {bodyComponent}
      </UserProvider>
    </ApolloProvider>
  )
}
