import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'

import LogoImage from '~/images/logo'
import Nav from '~/components/layout/nav'
import * as css from './header.module.css'

export interface SiteMetadata {
  site: {
    siteMetadata: {
      title: string
      description: string
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
        description
      }
    }
  }
`

const Header: React.FC<HeaderProps> = ({ shouldShowBigHeader }) => {
  const data: SiteMetadata = useStaticQuery(HEADER_QUERY)
  const { title, description } = data.site.siteMetadata

  return (
    <header className={css.bigHeader}>
      <Nav />
      {shouldShowBigHeader && (
        <div className={css.logoImage}>
          <LogoImage width='30vmin' />
        </div>
      )}
      <h1 className={css.logoText}>{title}</h1>
      <h1 className={css.logoSubtext}>{description}</h1>
    </header>
  )
}

export default Header
