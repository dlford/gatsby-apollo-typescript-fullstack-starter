import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'

import LogoImage from '~/images/logo-image'
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
    <header className={css.topBar}>
      <h1 className={css.titleText}>{title}</h1>
      <LogoImage />
    </header>
  )
}

export default Header
