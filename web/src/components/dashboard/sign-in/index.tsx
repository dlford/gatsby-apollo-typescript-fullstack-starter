import React, { useContext } from 'react'

import Article from '~/components/article'
import { UserContext } from '~/context/user'
import Button from '~/components/button'

const SignInComponent = () => {
  const { user, signInLoading, signInError } = useContext(UserContext)
  console.log(user)
  return (
    <Article>
      <h1>Sign In</h1>
      <p>Please sign in to continue</p>
      {signInLoading ? (
        <p>Loading...</p>
      ) : (
        <Button
          primary
          onClick={() =>
            user.signIn({
              email: 'dan@dlford.io',
              password: '123456',
            })
          }
        >
          Sign In
        </Button>
      )}
      {signInError && <div>{signInError.message}</div>}
    </Article>
  )
}

export default SignInComponent
