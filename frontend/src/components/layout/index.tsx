import React from 'react'

import Header from './header'
import '~/styles/reset.css'
import '~/styles/layout.css'

export interface LayoutProps {
  children: JSX.Element[] | JSX.Element
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='page-wrapper'>
      <Header />
      <main>{children}</main>
    </div>
  )
}

export default Layout
