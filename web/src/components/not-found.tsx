import React, { ElementType } from 'react'
import { RouteComponentProps } from '@reach/router'

import Article from '~/components/article'

const NotFoundComponent: ElementType<RouteComponentProps> = () => (
  <>
    <Article>
      <h1>NOT FOUND</h1>
      <p>
        You just hit a route that doesn&#39;t exist... the sadness.
      </p>
    </Article>
  </>
)

export default NotFoundComponent
