import axios from 'axios'

const API_URL = 'http://localhost:3000/graphql'

export const signUp = async (variables): Promise<any> =>
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

export const signIn = async (variables) =>
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

export const me = async (token) =>
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

export const user = async (token, variables) =>
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

export const users = async (token) =>
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

export const updateUser = async (variables, token) =>
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

export const deleteUser = async (variables, token) =>
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
