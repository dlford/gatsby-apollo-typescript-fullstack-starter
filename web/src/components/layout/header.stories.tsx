import React from 'react'
import { storiesOf } from '@storybook/react'

import Header from './header'

storiesOf('Header', module)
  .add('Big', () => <Header shouldShowBigHeader={true} />)
  .add('Small', () => <Header shouldShowBigHeader={false} />)
