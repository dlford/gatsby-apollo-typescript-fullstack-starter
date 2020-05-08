import React, { useState } from 'react'
import { ApolloProvider } from 'react-apollo'

import Dashboard from '~/dashboard'
import useApollo from '~/lib/apollo-client'
import { UserProvider } from '~/context/user'

export interface DashboardPageProps {
  location: Location
}

const DashboardPage = ({ location }: DashboardPageProps) => {
  const [token, setToken] = useState<string | void>()
  const { client } = useApollo(token)
  return (
    <ApolloProvider client={client}>
      <UserProvider token={token} setToken={setToken}>
        <Dashboard location={location} />
      </UserProvider>
    </ApolloProvider>
  )
}

export default DashboardPage
