import React, { useState, FormEvent } from 'react'
import { Link } from 'gatsby'
import { RouteComponentProps } from '@reach/router'
import tw from 'twin.macro'

import useTotpSetup from '~/hooks/use-totp-setup'
import SEO from '~/components/seo'
import Article from '~/components/article'
import Button from '~/components/button'
import Loader from '~/components/loader'
import Form from '~/components/form'

const ErrorText = tw.p`
    h-8
    my-8
    font-bold
    text-red-800
    text-center
  `

const SetupTotpComponent: React.ElementType<RouteComponentProps> = () => {
  const [shouldShowBase32, setShouldShowBase32] = useState<boolean>(
    false,
  )

  const {
    setupTotp,
    setupData,
    setupLoading,
    setupError,
    enableTotp,
    enableData,
    enableLoading,
    enableError,
  } = useTotpSetup()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const totpToken = e.currentTarget.token.value
    enableTotp({ variables: { token: totpToken } }).catch(() => {
      return
    })
  }

  return (
    <Article>
      <SEO title='Setup TOTP' />
      <Link to='/app'>Back to Dashboard</Link>
      {!enableData && (
        <>
          <h1>Set Up TOTP</h1>
          <p style={{ paddingBottom: '2rem' }}>
            A Time-based One Time Password (TOTP) is a form of Two
            Factor Authentication (2FA) for enhanced security. You
            will use an app such as Google Authenticator or FreeOTP to
            scan the QR code that will be generated below, and later
            to generate a six digit code when you need to log in.
          </p>
        </>
      )}
      {!setupLoading && !setupData && (
        <div style={{ textAlign: 'center' }}>
          <Button
            onClick={() =>
              setupTotp().catch(() => {
                return
              })
            }
          >
            Let&apos;s do it!
          </Button>
        </div>
      )}
      {(!!setupLoading || !!enableLoading) && <Loader />}
      {!!setupData && !setupError && !enableData && (
        <>
          <div style={{ textAlign: 'center' }}>
            <img
              style={{ margin: '0 auto' }}
              src={setupData.setupTotp.qr}
            />
            <div style={{ minHeight: '3rem' }}>
              {!shouldShowBase32 && (
                <div>
                  <Button onClick={() => setShouldShowBase32(true)}>
                    Show Secret
                  </Button>
                </div>
              )}
              {!!shouldShowBase32 && (
                <p>{setupData.setupTotp.base32}</p>
              )}
            </div>
          </div>
          <p style={{ paddingTop: '2rem' }}>
            Scan the code above in your TOTP app, or view the secret
            in plaintext to copy and paste it. Enter a valid TOTP
            token from your app in the box below to enable TOTP
            protection.
          </p>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Form onSubmit={handleSubmit} method='post'>
              <label htmlFor='token'>TOTP Token</label>
              <input name='token' type='text' maxLength={6} />
              <button type='submit' disabled={!!enableLoading}>
                Submit
              </button>
            </Form>
          </div>
        </>
      )}
      {!!setupError && (
        <ErrorText>
          {setupError.message.replace(/GraphQL error: /, '')}
        </ErrorText>
      )}
      {!!enableError && (
        <ErrorText>
          {enableError.message.replace(/GraphQL error: /, '')}
        </ErrorText>
      )}
      {!!enableData && (
        <>
          <h1>Nice!</h1>
          <p>
            TOTP security has been enabled for your account, please
            write down the ten recovery codes below and keep them in a
            safe place. These codes can be used in the event that your
            TOTP secret is lost or unavailable, each code may only be
            used one time, you can get new codes by disabling and
            re-enabling TOTP.
          </p>
          <ul
            style={{
              paddingTop: '2rem',
              fontFamily: 'monospace',
              listStyle: 'none',
            }}
          >
            {enableData.enableTotp.recoveryCodes.map(
              (code: string) => (
                <li key={code}>{code}</li>
              ),
            )}
          </ul>
        </>
      )}
    </Article>
  )
}

export default SetupTotpComponent
