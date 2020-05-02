import React, { ElementType } from 'react'
import { RouteComponentProps } from '@reach/router'

import Article from '~/components/article'

const SignInComponent: ElementType<RouteComponentProps> = () => (
  <Article>
    <h1>Sign In</h1>
    <p>Please sign in to continue</p>
  </Article>
)

export default SignInComponent
