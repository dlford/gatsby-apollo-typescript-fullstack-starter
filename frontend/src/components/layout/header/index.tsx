import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'

import LogoImage from '~/images/logo'
import * as css from './header.module.css'

const HEADER_QUERY = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

const Header: React.FC = () => {
  const {
    site: {
      siteMetadata: { title },
    },
  } = useStaticQuery(HEADER_QUERY)

  return (
    <header className={css.bigHeader}>
      <div className={css.logoImage}>
        <LogoImage width='30vmin' />
      </div>
      <h1 className={css.logoText}>{title}</h1>
    </header>
  )
}

export default Header
