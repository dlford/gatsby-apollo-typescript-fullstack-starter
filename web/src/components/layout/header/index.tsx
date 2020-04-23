import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import tw from 'twin.macro'

import LogoImage from '~/images/logo'
import Nav from '~/components/layout/nav'
import css from './header.module.css'

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
const Image = tw.div`w-full flex justify-center pt-4 object-center`
const Text = tw.h1`pb-8 text-center text-4xl font-black leading-tight`

const Header = ({ shouldShowBigHeader }: HeaderProps) => {
  const data: SiteMetadata = useStaticQuery(HEADER_QUERY)
  const { title } = data.site.siteMetadata

  return (
    <Wrapper>
      <Nav />
      {shouldShowBigHeader && (
        <Image>
          <LogoImage width='30vmin' />
        </Image>
      )}
      <Text>{title}</Text>
    </Wrapper>
  )
}

export default Header
