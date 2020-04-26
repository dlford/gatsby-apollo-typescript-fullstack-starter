import React from 'react'
import { render } from '@testing-library/react'
import Article from '../'

describe('Article', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <Article>
        <h1>Test</h1>
      </Article>,
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
