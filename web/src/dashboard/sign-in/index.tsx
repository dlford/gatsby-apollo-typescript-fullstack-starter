import React, { useContext, FormEvent } from 'react'
import tw from 'twin.macro'

import Article from '~/components/article'
import { UserContext } from '~/context/user'
import Form from '~/components/form'
import Loader from '~/components/loader'

const SignInComponent = () => {
  const { user, signInLoading, signInError } = useContext(UserContext)

  const handleSumbit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = e.currentTarget.email.value
    const password = e.currentTarget.password.value
    user.signIn({ email, password })
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
          <h1>Sign In</h1>
          <p>Please sign in to continue</p>
          <ErrorText>
            {signInError
              ? signInError.message.replace(/GraphQL error: /, '')
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
          <button disabled={!!signInLoading} type='submit'>
            Submit
          </button>
        </Form>
      </FormWrapper>
      {!!signInLoading && <Loader />}
    </>
  )
}

export default SignInComponent
