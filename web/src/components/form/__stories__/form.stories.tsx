import React from 'react'
import { storiesOf } from '@storybook/react'

import Form from '../'

storiesOf('Elements', module).add('Form', () => (
  <Form onSubmit={(e) => e.preventDefault()}>
    <label htmlFor='input'>Input</label>
    <input type='text' name='input' />
    <button type='submit'>Submit</button>
  </Form>
))
