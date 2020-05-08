import React, { useState } from 'react'

import Dashboard from '~/dashboard'
import { UserProvider } from '~/context/user'

export interface DashboardPageProps {
  location: Location
}

const DashboardPage = ({ location }: DashboardPageProps) => {
  const [token, setToken] = useState<string | void>()
  return (
    <UserProvider token={token} setToken={setToken}>
      <Dashboard location={location} />
    </UserProvider>
  )
}

export default DashboardPage
