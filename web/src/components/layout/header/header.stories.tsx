import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs, boolean } from '@storybook/addon-knobs'

import Header from '.'

storiesOf('Layout', module)
  .addDecorator(withKnobs)
  .add('Header', () => (
    <Header shouldShowBigHeader={boolean('Big', true)} />
  ))
