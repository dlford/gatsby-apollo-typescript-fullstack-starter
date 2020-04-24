import React from 'react'
import { graphql, useStaticQuery, Link } from 'gatsby'
import tw from 'twin.macro'
import styled from '@emotion/styled'

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

const Wrapper = styled.div`
  ul {
    ${tw`
      flex
      flex-row
      flex-no-wrap
      m-0
      pt-3
      items-center
      justify-end
      list-none
    `};
  }
  li {
    ${tw`
      font-montserrat
      font-black
      text-xs
      text-gray-900
      pr-4
    `};
  }
`

const NavComponent = () => {
  const data = useStaticQuery(NAV_ITEMS_QUERY)
  const navItems: NavItem[] = data.site.siteMetadata.navItems
  return (
    <Wrapper>
      <ul>
        {navItems.map((item, idx) => {
          if (item.isRelative) {
            return (
              <Link key={idx} to={item.url}>
                <li>{item.title}</li>
              </Link>
            )
          } else {
            return (
              <a
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
    </Wrapper>
  )
}

export default NavComponent
