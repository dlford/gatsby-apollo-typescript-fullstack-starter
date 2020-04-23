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
    @assign ${tw`
      flex-no-wrap
      flex-row
      m-0
      pt-4
      items-center
      justify-end
      list-none
    `};
  }
  li {
    @assign ${tw`
      font-montserrat
      font-black
      text-orange-900
    `};
  }
`

const Nav = () => {
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

export default Nav
