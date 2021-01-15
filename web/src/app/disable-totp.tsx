import React, { FormEvent } from 'react'
import { Link } from 'gatsby'
import tw from 'twin.macro'

import useTotpSetup from '~/hooks/use-totp-setup'
import SEO from '~/components/seo'
import Article from '~/components/article'
import Loader from '~/components/loader'
import Form from '~/components/form'

const ErrorText = tw.p`
    h-8
    my-8
    font-bold
    text-red-800
    text-center
  `

export default function DisableTotpComponent() {
  const {
    disableTotp,
    disableData,
    disableError,
    disableLoading,
  } = useTotpSetup()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const password = e.currentTarget.password.value
    disableTotp({ variables: { password } }).catch(() => {
      return
    })
  }

  return (
    <Article style={{ textAlign: 'center' }}>
      <SEO title='Disable TOTP' />
      <Link to='/app'>Back to Dashboard</Link>
      {!disableData && (
        <>
          <h1>Disable TOTP</h1>
          <p>Enter your password to disable TOTP.</p>
          <Form
            onSubmit={handleSubmit}
            method='post'
            style={{ margin: '2rem auto' }}
          >
            <label htmlFor='password'>Password</label>
            <input type='password' name='password' />
            <button
              type='submit'
              disabled={!!disableLoading || !!disableData}
            >
              Submit
            </button>
          </Form>
        </>
      )}
      {!!disableLoading && <Loader />}
      {!!disableError && (
        <ErrorText>
          {disableError.message.replace(/GraphQL error: /, '')}
        </ErrorText>
      )}
      {!!disableData && (
        <>
          <h1>Success</h1>
          <p>TOTP has been disabled for your account.</p>
        </>
      )}
    </Article>
  )
}
