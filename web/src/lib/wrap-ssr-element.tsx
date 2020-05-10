import React, { useContext } from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import { renderToString } from 'react-dom/server'
import useApollo from './apollo-client'

import { UserProvider } from '~/context/user'
import { TokenProvider, TokenContext } from '~/context/token'

interface ReplaceBodyProps {
  bodyComponent: JSX.Element | JSX.Element[]
  replaceBodyHTMLString: any
}

interface ReplaceBodySubProps {
  bodyComponent: JSX.Element | JSX.Element[]
}

export const replaceRenderer = ({
  bodyComponent,
  replaceBodyHTMLString,
}: ReplaceBodyProps) => {
  const ConnectedBody = () => (
    <TokenProvider>
      <SubRoot bodyComponent={bodyComponent} />
    </TokenProvider>
  )

  replaceBodyHTMLString(renderToString(<ConnectedBody />))
}

const SubRoot = ({ bodyComponent }: ReplaceBodySubProps) => {
  const { token, setToken } = useContext(TokenContext)
  const { client } = useApollo(token)
  return (
    <ApolloProvider client={client}>
      <UserProvider token={token} setToken={setToken}>
        {bodyComponent}
      </UserProvider>
    </ApolloProvider>
  )
}
