import React from 'react'
import { render } from '@testing-library/react'

import Form from '../form'

describe('Form', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <Form>
        <label htmlFor='email'>Email Address</label>
        <input type='email' name='email' />
        <label htmlFor='password'>Password</label>
        <input type='password' name='password' />
        <button type='submit'>Submit</button>
      </Form>,
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
