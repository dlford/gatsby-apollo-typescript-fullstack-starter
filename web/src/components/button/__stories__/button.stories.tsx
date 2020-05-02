import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs, boolean, text } from '@storybook/addon-knobs'

import Button from '../'

storiesOf('Elements', module)
  .addDecorator(withKnobs)
  .add('Button', () => (
    <Button primary={boolean('Primary', true)}>
      {text('Text', 'Click Me!')}
    </Button>
  ))
