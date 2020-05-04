import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import tw from 'twin.macro'
import styled from '@emotion/styled'

import AbstractHeader from '~/images/abstract-header'
import LogoImage from '~/images/logo'

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

const Header = tw.header`mb-16`
const Image = tw.div`w-12 sm:w-24 lg:w-32 pt-4 ml-auto mr-auto`
const H1 = tw.h1`font-montserrat py-4 px-2 text-center text-gray-900 text-2xl lg:text-4xl font-black leading-tight`

const BGWrapper = styled.div`
  z-index: -1;
  overflow: hidden;
  opacity: 0.175;
  position: absolute;
  top: 0;
  left: 0;
`

const HeaderComponent = ({ shouldShowBigHeader }: HeaderProps) => {
  const data = useStaticQuery<QueryProps>(HEADER_QUERY)
  const { title } = data.site.siteMetadata

  return (
    <Header>
      <BGWrapper>
        <AbstractHeader />
      </BGWrapper>
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
