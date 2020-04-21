import React from 'react'

import Header from '~/components/header'
import './reset.css'
import './layout.css'

export interface LayoutProps {
  children: JSX.Element[] | JSX.Element
}

const Layout: React.FC<LayoutProps> = ({ children }) => { return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  )
}

export default Layout
