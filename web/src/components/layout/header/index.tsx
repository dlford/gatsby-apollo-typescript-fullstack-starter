import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import tw from 'twin.macro'

import LogoImage from '~/images/logo'
import Nav from '~/components/layout/nav'

export interface SiteMetadata {
  site: {
    siteMetadata: {
      title: string
    }
  }
}

export interface HeaderProps {
  shouldShowBigHeader: boolean
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

const Wrapper = tw.header`bg-orange-400 mb-16 shadow-lg`
const Image = tw.div`w-32 sm:w-48 md:w-1/3 lg:w-64 pt-4 ml-auto mr-auto`
const Text = tw.h1`font-montserrat py-4 px-2 text-center text-orange-900 text-4xl lg:text-5xl font-black leading-tight`

const Header = ({ shouldShowBigHeader }: HeaderProps) => {
  const data: SiteMetadata = useStaticQuery(HEADER_QUERY)
  const { title } = data.site.siteMetadata

  return (
    <Wrapper>
      <Nav />
      {shouldShowBigHeader && (
        <Image>
          <LogoImage />
        </Image>
      )}
      <Text>{title}</Text>
    </Wrapper>
  )
}

export default Header
