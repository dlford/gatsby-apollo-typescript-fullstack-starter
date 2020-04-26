import * as Gatsby from 'gatsby'
import React from 'react'
import renderer from 'react-test-renderer'
import Layout from '.'

const locations = [
  { pathname: '/' },
  { pathname: '/gatsby-typescript-starter-kitchen-sink/' },
  { pathname: '/some-other-page' },
]

describe('Layout', () => {
  for (path of locations) {
    const location = Object.defineProperty(window, 'location', {
      pathname: path,
    })
    it('renders correctly', () => {
      const tree = renderer
        .create(
          <Layout location={location}>
            <div>hello</div>
          </Layout>,
        )
        .toJSON()
      expect(tree).toMatchInlineSnapshot()
    })
  }
})
