import React, { useState, FormEvent } from 'react'
import tw from 'twin.macro'

import Article from '~/components/article'
import useUser from '~/context/user'
import Form from '~/components/form'
import Loader from '~/components/loader'

const SignInComponent = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isRecovery, setIsRecovery] = useState(false)
  const {
    user,
    signInLoading,
    signInError,
    totpEnabled,
    totpSignInToken,
    totpSignInLoading,
    totpSignInError,
    signUpLoading,
    signUpError,
  } = useUser()

  const handleSignInSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = e.currentTarget.email.value
    const password = e.currentTarget.password.value
    isSignUp
      ? user.signUp({ email, password })
      : user.signIn({ email, password })
  }

  const handleTotpSignInSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const token = e.currentTarget?.token?.value
    const recoveryCode = e.currentTarget?.recoveryCode?.value
    user.totpSignIn({ token, recoveryCode, totpSignInToken })
  }

  const TextWrapper = tw.div`
    text-center
  `
  const FormWrapper = tw.div`
    my-8
  `
  const ErrorText = tw.p`
    h-8
    my-8
    font-bold
    text-red-800
  `

  // TODO:TOTP : Reset errors on new actions

  return (
    <>
      <TextWrapper>
        <Article>
          {!totpEnabled && (
            <>
              <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
              <p>
                {isSignUp
                  ? 'Please create an account to continue'
                  : 'Please sign in to continue'}
              </p>
            </>
          )}
          {!!totpEnabled && <h1>TOTP Authentication</h1>}
          <ErrorText>
            {totpSignInError && !signInError && !signUpError
              ? totpSignInError.message.replace(/GraphQL error: /, '')
              : ''}
            {signInError
              ? signInError.message.replace(/GraphQL error: /, '')
              : ''}
            {signUpError && !signInError
              ? signUpError.message.replace(/GraphQL error: /, '')
              : ''}
          </ErrorText>
        </Article>
      </TextWrapper>
      {!totpEnabled && (
        <FormWrapper>
          <Form method='post' onSubmit={handleSignInSubmit}>
            <label htmlFor='email'>Email Address</label>
            <input type='email' name='email' />
            <label htmlFor='password'>Password</label>
            <input type='password' name='password' />
            <button
              disabled={!!signInLoading || !!signUpLoading}
              type='submit'
            >
              Submit
            </button>
            {!process.env.DISABLE_SIGNUP && (
              <Article>
                {isSignUp ? 'Already' : "Don't"} have an account?{' '}
                <a
                  role='button'
                  aria-label={
                    isSignUp
                      ? 'Sign in to an existing account'
                      : 'Create an account'
                  }
                  tabIndex={0}
                  onClick={() => setIsSignUp((prev) => !prev)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      setIsSignUp((prev) => !prev)
                    }
                  }}
                >
                  {isSignUp ? 'Sign in' : 'Create one'} here!
                </a>
              </Article>
            )}
          </Form>
        </FormWrapper>
      )}
      {!!totpEnabled && (
        <FormWrapper>
          <Form method='post' onSubmit={handleTotpSignInSubmit}>
            <label htmlFor={isRecovery ? 'recoveryCode' : 'token'}>
              {isRecovery ? 'Recovery Code' : 'TOTP Token'}
            </label>
            <input
              type='text'
              name={isRecovery ? 'recoveryCode' : 'token'}
              maxLength={isRecovery ? 9999 : 6}
            />
            <button disabled={!!totpSignInLoading} type='submit'>
              Submit
            </button>
          </Form>
          <Article style={{ textAlign: 'center' }}>
            <a
              role='button'
              aria-label={
                isRecovery
                  ? 'Use a TOTP token'
                  : 'Use a recovery code'
              }
              tabIndex={0}
              onClick={() => setIsRecovery((prev) => !prev)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  setIsRecovery((prev) => !prev)
                }
              }}
            >
              {isRecovery ? 'Use TOTP token' : 'Use recovery code'}
            </a>
          </Article>
        </FormWrapper>
      )}
      {(!!signInLoading ||
        !!signUpLoading ||
        !!totpSignInLoading) && <Loader />}
    </>
  )
}

export default SignInComponent
