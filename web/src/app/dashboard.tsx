import React, { useState } from 'react'
import { Link } from 'gatsby'
import { RouteComponentProps } from '@reach/router'
import useUser from '~/context/user'
import tw from 'twin.macro'

import SEO from '~/components/seo'
import Article from '~/components/article'
import Button from '~/components/button'

const ButtonWrap = tw.div`py-4`

const DashboardComponent: React.ElementType<RouteComponentProps> = () => {
  const [allDevices, setAllDevices] = useState(false)
  const { user } = useUser()

  return (
    <Article>
      <SEO title='Dashboard' />
      <h1>Private Route</h1>
      <p>You cannot see this without logging in first.</p>
      <p>
        You should keep an eye on your{' '}
        <Link to='/app/sessions'>active sessions</Link> for security
        purposes.
      </p>
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <input
          name='allDevices'
          type='checkbox'
          checked={allDevices}
          onChange={(e) => {
            setAllDevices(e.target.checked)
          }}
        />
        <label htmlFor='allDevices'> Sign out all devices</label>
        <ButtonWrap>
          <Button
            primary
            onClick={() => user.signOut({ allDevices })}
          >
            Sign Out
          </Button>
        </ButtonWrap>
      </div>
      <div style={{ marginTop: '4rem' }}>
        <Link to='/'>Back to home page</Link>
      </div>
    </Article>
  )
}

export default DashboardComponent
