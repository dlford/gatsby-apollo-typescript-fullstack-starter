/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

const API_URL = 'http://localhost:3000/graphql'

export const users = async (token): Promise<any> =>
  axios.post(
    API_URL,
    {
      query: `
      {
        users {
          id
          email
          role
        }
      }
    `,
    },
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : null,
  )

export const user = async (variables, token): Promise<any> =>
  axios.post(
    API_URL,
    {
      query: `
      query ($id: ID!) {
        user(id: $id) {
          id
          email
          role
        }
      }
    `,
      variables,
    },
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : null,
  )

export const me = async (token: string | void): Promise<any> =>
  await axios.post(
    API_URL,
    {
      query: `
        {
          me {
            id
            email
            role
          }
        }
      `,
    },
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : null,
  )

export const signUp = async (variables): Promise<any> =>
  axios.post(API_URL, {
    query: `
      mutation(
        $email: EmailAddress!,
        $password: String!
      ) {
        signUp(
          email: $email,
          password: $password
        ) {
          token
        }
      }
    `,
    variables,
  })

export const signIn = async (variables): Promise<any> =>
  await axios.post(API_URL, {
    query: `
      mutation ($email: EmailAddress!, $password: String!) {
        signIn(email: $email, password: $password) {
          token
        }
      }
    `,
    variables,
  })

export const signOut = async (
  token: string | void,
  cookies: string | void,
  variables,
): Promise<any> =>
  await axios.post(
    API_URL,
    {
      query: `
      mutation($allDevices: Boolean) {
        signOut(allDevices: $allDevices)
      }
    `,
      variables,
    },
    {
      headers: {
        Cookie: cookies || '',
        Authorization: token ? `Bearer ${token}` : '',
      },
    },
  )

export const refreshToken = async (
  cookies: string | void,
): Promise<any> =>
  await axios.post(
    API_URL,
    {
      query: `
        mutation {
          refreshToken
        }
      `,
    },
    cookies
      ? {
          headers: {
            Cookie: cookies,
          },
        }
      : null,
  )

export const updateUser = async (variables, token): Promise<any> =>
  axios.post(
    API_URL,
    {
      query: `
        mutation ($email: EmailAddress!) {
          updateUser(email: $email) {
            email
            role
            id
          }
        }
      `,
      variables,
    },
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : null,
  )

export const deleteUser = async (variables, token): Promise<any> =>
  axios.post(
    API_URL,
    {
      query: `
        mutation ($id: ID!) {
          deleteUser(id: $id)
        }
      `,
      variables,
    },
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : null,
  )
