import React from 'react'
import { render } from '@testing-library/react'

import Loader from '../'

describe('Loader', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<Loader />)
    expect(asFragment()).toMatchSnapshot()
  })
})
