import React from 'react'
import { render } from '@testing-library/react'
import Article from '../article'

describe('Article', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <Article>
        <h1>Test</h1>
      </Article>,
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
