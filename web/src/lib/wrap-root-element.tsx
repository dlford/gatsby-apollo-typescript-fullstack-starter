import React, { useContext } from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import useApollo from './apollo-client'

import { UserProvider } from '~/context/user'
import { TokenProvider, TokenContext } from '~/context/token'

export interface WrapRootProps {
  element: JSX.Element | JSX.Element[]
}

export const wrapRootElement = ({ element }: WrapRootProps) => {
  return (
    <TokenProvider>
      <SubRoot element={element} />
    </TokenProvider>
  )
}

const SubRoot = ({ element }: WrapRootProps) => {
  const { token, setToken } = useContext(TokenContext)
  const { client } = useApollo(token)
  return (
    <ApolloProvider client={client}>
      <UserProvider token={token} setToken={setToken}>
        {element}
      </UserProvider>
    </ApolloProvider>
  )
}
