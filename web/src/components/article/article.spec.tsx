import React from 'react'
import renderer from 'react-test-renderer'
import Article from '.'

describe('Article', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Article />).toJSON()
    expect(tree).toMatchInlineSnapshot()
  })
})
