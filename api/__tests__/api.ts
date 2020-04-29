import axios from 'axios'

const API_URL = 'http://localhost:3000/graphql'

export const signUp = async (variables): Promise<object> =>
  axios.post(API_URL, {
    query: `
      mutation(
        $email: String!,
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

export const signIn = async (variables): Promise<object> =>
  await axios.post(API_URL, {
    query: `
      mutation ($email: String!, $password: String!) {
        signIn(email: $email, password: $password) {
          token
        }
      }
    `,
    variables,
  })

export const me = async (token): Promise<object> =>
  await axios.post(
    API_URL,
    {
      query: `
        {
          me {
            id
            email
            username
          }
        }
      `,
    },
    token
      ? {
          headers: {
            token: token,
          },
        }
      : null,
  )

export const user = async (token, variables): Promise<object> =>
  axios.post(
    API_URL,
    {
      query: `
      query ($id: ID!) {
        user(id: $id) {
          id
          username
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
            token: token,
          },
        }
      : null,
  )

export const users = async (token): Promise<object> =>
  axios.post(
    API_URL,
    {
      query: `
      {
        users {
          id
          username
          email
          role
        }
      }
    `,
    },
    token
      ? {
          headers: {
            token: token,
          },
        }
      : null,
  )

export const updateUser = async (variables, token): Promise<object> =>
  axios.post(
    API_URL,
    {
      query: `
        mutation ($email: String!) {
          updateUser(email: $email) {
            email
          }
        }
      `,
      variables,
    },
    token
      ? {
          headers: {
            token: token,
          },
        }
      : null,
  )

export const deleteUser = async (variables, token): Promise<object> =>
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
            token: token,
          },
        }
      : null,
  )
