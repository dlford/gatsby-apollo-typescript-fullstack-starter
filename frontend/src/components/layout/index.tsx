import React from 'react'

import fonts from '~/styles/fonts'
import Header from '~/components/header'
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
