import * as Gatsby from 'gatsby'
import React from 'react'
import { Helmet } from 'react-helmet'
import { render, cleanup } from '@testing-library/react'
import SEO from '../seo'

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery')

const meta: any = [
  { name: 'testname', content: 'test' },
  { property: 'testproperty', content: 'test' },
]

beforeEach(() => {
  useStaticQuery.mockImplementationOnce(() => ({
    site: {
      siteMetadata: {
        title: 'A Title',
        description: 'A Description',
        author: 'An Author',
      },
    },
  }))
  render(
    <SEO
      title='test page'
      meta={meta}
      description='Description'
      lang='test'
    />,
  )
})

afterEach(cleanup)

describe('SEO', () => {
  it('matches snapshot', () => {
    expect(Helmet.peek()).toMatchSnapshot()
  })
})
