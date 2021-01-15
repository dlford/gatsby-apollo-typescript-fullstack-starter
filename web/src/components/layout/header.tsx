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
const H1 = tw.h1`font-montserrat py-4 px-2 text-center text-gray-900 lg:text-xl font-black leading-tight`

type BGWrapperProps = {
  bright: boolean
}

const BGWrapper = styled.div<BGWrapperProps>`
  z-index: -1;
  overflow: hidden;
  position: absolute;
  opacity: ${({ bright }) => (bright ? '0.5' : '0.15')};
  top: 0;
  left: 0;
`

export default function HeaderComponent({
  shouldShowBigHeader,
}: HeaderProps) {
  const data = useStaticQuery<QueryProps>(HEADER_QUERY)
  const { title } = data.site.siteMetadata

  return (
    <Header>
      <BGWrapper bright={shouldShowBigHeader}>
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
