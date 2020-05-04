import React, { useContext } from 'react'
import { RouteComponentProps } from '@reach/router'
import { UserContext } from '~/context/user'

import SEO from '~/components/seo'
import Article from '~/components/article'
import Button from '~/components/button'

const HomeComponent: React.ElementType<RouteComponentProps> = () => {
  const { user } = useContext(UserContext)

  return (
    <Article>
      <SEO title='Home' />
      <h1>Private Route</h1>
      <p>You cannot see this without logging in first.</p>
      <Button primary onClick={user.signOut}>
        Sign Out
      </Button>
    </Article>
  )
}

export default HomeComponent
