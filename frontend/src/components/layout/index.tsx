import React from 'react'

import Header from '~/components/header'
import './reset.css'
import './layout.css'
import * as css from './layout.module.css'

export interface LayoutProps {
  children: JSX.Element[] | JSX.Element
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={css.wrapper}>
      <Header />
      <main>{children}</main>
    </div>
  )
}

export default Layout
