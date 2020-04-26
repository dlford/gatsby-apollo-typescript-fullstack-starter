import React from 'react'
import renderer from 'react-test-renderer'
import Header from '.'

describe('Footer', () => {
  it('renders correctly', () => {
    let tree = renderer
      .create(<Header shouldShowBigHeader={true} />)
      .toJSON()
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
    tree = renderer
      .create(<Header shouldShowBigHeader={false} />)
      .toJSON()
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
