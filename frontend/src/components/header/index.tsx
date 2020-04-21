import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'

import fonts from '~/styles/fonts'
import * as css from './header.module.css'

interface HeaderCSS {
  header: any
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

const Header: React.FC = () => {
  const {
    site: {
      siteMetadata: {
        title
      }
    }
  } = useStaticQuery(HEADER_QUERY)

  return (
    <header className={css.header}>
      <h1 style={{ fontFamily: fonts.montserrat }}>{title}</h1>
    </header>
  )
}

export default Header
