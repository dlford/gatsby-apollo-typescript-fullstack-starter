import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import useApollo from './apollo-client'

import { UserProvider } from '~/context/user'
import useToken, { TokenProvider } from '~/context/token'

export interface WrapRootProps {
  element: JSX.Element | JSX.Element[]
}

export function wrapRootElement({ element }: WrapRootProps) {
  return (
    <TokenProvider>
      <SubRoot element={element} />
    </TokenProvider>
  )
}

const SubRoot = ({ element }: WrapRootProps) => {
  const { token, setToken } = useToken()
  const { client } = useApollo(token)
  return (
    <ApolloProvider client={client}>
      <UserProvider token={token} setToken={setToken}>
        {element}
      </UserProvider>
    </ApolloProvider>
  )
}
