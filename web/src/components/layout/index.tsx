import React from 'react'
import tw from 'twin.macro'

import Header from './header'
import Footer from './footer'

export interface LayoutProps {
  children: JSX.Element[] | JSX.Element
  location: Location
}

const Outer = tw.div`h-full w-full min-h-screen flex flex-col`

export default function Layout({ children, location }: LayoutProps) {
  return (
    <Outer>
      <Header
        shouldShowBigHeader={
          location.pathname === '/' ||
          location.pathname ===
            '/gatsby-typescript-starter-kitchen-sink/'
        }
      />
      <main>{children}</main>
      <Footer />
    </Outer>
  )
}
