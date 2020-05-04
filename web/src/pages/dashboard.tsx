import React from 'react'
import { ApolloProvider } from 'react-apollo'

import Dashboard from '~/dashboard'
import ApolloClient from '~/lib/apollo-client'
import { UserProvider } from '~/context/user'

export interface DashboardPageProps {
  location: Location
}

const DashboardPage = ({ location }: DashboardPageProps) => {
  return (
    <ApolloProvider client={ApolloClient}>
      <UserProvider>
        <Dashboard location={location} />
      </UserProvider>
    </ApolloProvider>
  )
}

export default DashboardPage
