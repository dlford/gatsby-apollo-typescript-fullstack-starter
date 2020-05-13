import React, { useContext, useState } from 'react'
import { Link } from 'gatsby'
import { RouteComponentProps } from '@reach/router'
import { UserContext } from '~/context/user'
import tw from 'twin.macro'

import SEO from '~/components/seo'
import Article from '~/components/article'
import Button from '~/components/button'

const ButtonWrap = tw.div`py-4`

const HomeComponent: React.ElementType<RouteComponentProps> = () => {
  const [allDevices, setAllDevices] = useState(false)
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
        <Button primary onClick={() => user.signOut({ allDevices })}>
          Sign Out
        </Button>
      </ButtonWrap>
      <input
        name='allDevices'
        type='checkbox'
        checked={allDevices}
        onChange={(e) => {
          setAllDevices(e.target.checked)
        }}
      />
      <label htmlFor='allDevices'> Sign out all devices</label>
    </Article>
  )
}

export default HomeComponent
