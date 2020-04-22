import React from 'react'

import Header from './header'
import Footer from './footer'
import '~/styles/reset.css'
import '~/styles/layout.css'

export interface LayoutProps {
  children: JSX.Element[] | JSX.Element
  location: Location
}

const Layout: React.FC<LayoutProps> = ({ children, location }) => {
  const shouldShowBigHeader: boolean = (() => {
    return location.pathname === '/'
  })()

  return (
    <div className='page-wrapper'>
      <Header {...{ shouldShowBigHeader }} />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
