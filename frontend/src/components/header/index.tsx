import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'

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
    <header className={css.header}>
      <h1 className={css.h1}>{title}</h1>
    </header>
  )
}

export default Header
