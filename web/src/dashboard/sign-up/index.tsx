import { Link } from 'gatsby'
import { RouteComponentProps } from '@reach/router'
import React, { useContext, FormEvent } from 'react'
import tw from 'twin.macro'

import Article from '~/components/article'
import { UserContext } from '~/context/user'
import Form from '~/components/form'
import Loader from '~/components/loader'

const SignUpComponent: React.ElementType<RouteComponentProps> = () => {
  const { user, signUpLoading, signUpError } = useContext(UserContext)

  const handleSumbit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (user.signUp && !process.env.DISABLE_SIGNUP) {
      const email = e.currentTarget.email.value
      const password = e.currentTarget.password.value
      user.signUp({ email, password })
    }
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

  if (process.env.DISABLE_SIGNUP) {
    return (
      <TextWrapper>
        <Article>
          <h1>Not Allowed</h1>
          <p>Sign up has been disabled by administrator.</p>
        </Article>
      </TextWrapper>
    )
  }

  return (
    <>
      <TextWrapper>
        <Article>
          <h1>Sign Up</h1>
          <p>Please create an account to continue</p>
          <p>
            Already have an account?{' '}
            <Link replace to='/dashboard'>
              Sign in here!
            </Link>
          </p>
          <ErrorText>
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
          <button disabled={!!signUpLoading} type='submit'>
            Submit
          </button>
        </Form>
      </FormWrapper>
      {!!signUpLoading && <Loader />}
    </>
  )
}

export default SignUpComponent
