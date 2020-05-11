import React, { useContext } from 'react'
import { Link } from 'gatsby'
import { RouteComponentProps } from '@reach/router'
import { UserContext } from '~/context/user'
import tw from 'twin.macro'

import SEO from '~/components/seo'
import Article from '~/components/article'
import Button from '~/components/button'

const ButtonWrap = tw.div`py-4`

const HomeComponent: React.ElementType<RouteComponentProps> = () => {
  const { user } = useContext(UserContext)

  return (
    <Article>
      <SEO title='Home' />
      <h1>Private Route</h1>
      <p>You cannot see this without logging in first.</p>
      <p>
        You should keep an eye on your{' '}
        <Link to='/dashboard/sessions'>active sessions</Link> for
        security purposes.
      </p>
      <ButtonWrap>
        <Button primary onClick={user.signOut}>
          Sign Out
        </Button>
      </ButtonWrap>
    </Article>
  )
}

export default HomeComponent
