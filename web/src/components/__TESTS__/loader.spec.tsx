import React from 'react'
import { render } from '@testing-library/react'

import Loader from '../loader'

describe('Loader', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Loader />)
    expect(asFragment()).toMatchSnapshot()
  })
})
