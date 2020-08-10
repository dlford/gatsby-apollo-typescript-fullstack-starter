import * as Gatsby from 'gatsby'
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import Layout from '../layout'

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery')
useStaticQuery.mockImplementation(() => ({
  site: {
    siteMetadata: {
      title: 'A Title',
    },
  },
}))

const paths = [
  '/',
  '/gatsby-typescript-starter-kitchen-sink/',
  '/some-other-path/',
]

paths.map((path) => {
  let asFragment: any

  beforeEach(() => {
    window.history.pushState({}, 'title', path)
    asFragment = render(
      <Layout location={window.location}>
        <div>hello</div>
      </Layout>,
    ).asFragment
  })

  afterEach(cleanup)

  describe('Layout', () => {
    it(`matches snapshot ${path}`, () => {
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
