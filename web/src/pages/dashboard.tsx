import React from 'react'

import Dashboard from '~/dashboard'

export interface DashboardPageProps {
  location: Location
}

const DashboardPage = ({ location }: DashboardPageProps) => {
  return <Dashboard location={location} />
}

export default DashboardPage
