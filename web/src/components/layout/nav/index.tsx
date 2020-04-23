import React from 'react'
import { graphql, useStaticQuery, Link } from 'gatsby'

import css from './nav.module.css'

export interface NavItem {
  title: string
  url: string
  isRelative: boolean
}

const NAV_ITEMS_QUERY = graphql`
  query {
    site {
      siteMetadata {
        navItems {
          title
          url
          isRelative
        }
      }
    }
  }
`

const Nav = () => {
  const data = useStaticQuery(NAV_ITEMS_QUERY)
  const navItems: NavItem[] = data.site.siteMetadata.navItems
  return (
    <ul className={css.navWrapper}>
      {navItems.map((item, idx) => {
        if (item.isRelative) {
          return (
            <Link className={css.navItem} key={idx} to={item.url}>
              <li>{item.title}</li>
            </Link>
          )
        } else {
          return (
            <a
              className={css.navItem}
              key={idx}
              href={item.url}
              target='_blank'
              rel='noopener noreferrer'
            >
              <li>{item.title}</li>
            </a>
          )
        }
      })}
    </ul>
  )
}

export default Nav
