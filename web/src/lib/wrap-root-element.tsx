import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import useApollo from './apollo-client'

export interface WrapRootProps {
  element: JSX.Element | JSX.Element[]
}

export const wrapRootElement = ({ element }: WrapRootProps) => {
  const { client } = useApollo()
  return <ApolloProvider client={client}>{element}</ApolloProvider>
}
