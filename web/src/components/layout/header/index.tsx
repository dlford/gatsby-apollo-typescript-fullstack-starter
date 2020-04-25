import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import tw from 'twin.macro'

import LogoImage from '~/images/logo'
import Nav from '~/components/layout/nav'

export interface HeaderProps {
  shouldShowBigHeader: boolean
}

type QueryProps = {
  site: {
    siteMetadata: {
      title: string
    }
  }
}

const HEADER_QUERY = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

const Header = tw.header`bg-gray-500 mb-16 shadow-lg`
const Image = tw.div`w-32 sm:w-1/4 lg:w-64 pt-4 ml-auto mr-auto`
const H1 = tw.h1`font-montserrat py-4 px-2 text-center text-gray-900 text-4xl lg:text-5xl font-black leading-tight`

const HeaderComponent = ({ shouldShowBigHeader }: HeaderProps) => {
  const data = useStaticQuery<QueryProps>(HEADER_QUERY)
  const { title } = data.site.siteMetadata

  return (
    <Header>
      <Nav />
      {shouldShowBigHeader && (
        <Image>
          <LogoImage />
        </Image>
      )}
      <H1>{title}</H1>
    </Header>
  )
}

export default HeaderComponent
