import React from 'react'
import renderer from 'react-test-renderer'
import Footer from '.'

describe('Footer', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Footer />).toJSON()
    expect(tree).toMatchInlineSnapshot(`
      <div
        className="css-1m8xtdc"
      >
        <footer
          className="css-1utbjgr"
        >
          <p>
            Copyleft 
            <span
              className="css-1k0tmud"
            >
              ©
            </span>
             DL Ford 2020
          </p>
        </footer>
      </div>
    `)
  })
})
