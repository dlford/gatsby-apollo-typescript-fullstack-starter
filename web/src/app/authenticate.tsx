import React, { useState, FormEvent } from 'react'
import tw from 'twin.macro'

import Article from '~/components/article'
import useUser from '~/context/user'
import Form from '~/components/form'
import Loader from '~/components/loader'

const SignInComponent = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const {
    user,
    signInLoading,
    signInError,
    signUpLoading,
    signUpError,
  } = useUser()

  const handleSumbit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = e.currentTarget.email.value
    const password = e.currentTarget.password.value
    isSignUp
      ? user.signUp({ email, password })
      : user.signIn({ email, password })
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

  return (
    <>
      <TextWrapper>
        <Article>
          <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
          <p>
            {isSignUp
              ? 'Please create an account to continue'
              : 'Please sign in to continue'}
          </p>
          <ErrorText>
            {signInError
              ? signInError.message.replace(/GraphQL error: /, '')
              : ''}
            {signUpError
              ? signUpError.message.replace(/GraphQL error: /, '')
              : ''}
          </ErrorText>
        </Article>
      </TextWrapper>
      <FormWrapper>
        <Form method='post' onSubmit={handleSumbit}>
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
      {!!signInLoading || (!!signUpLoading && <Loader />)}
    </>
  )
}

export default SignInComponent
