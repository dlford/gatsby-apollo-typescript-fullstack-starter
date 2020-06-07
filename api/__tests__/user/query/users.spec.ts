import { setup, teardown, env } from '../env'

let adminToken
const adminUser = 'usersadmin@jest.test'
const adminPassword =
  'sdf5h4s6gh546s5fd46gadf4gh6sd8h46sdf54gh6a54fg6a54g65sd4fgg65a4'
const { SECRET, models, userApi, jwt } = env

beforeAll(async () => {
  adminToken = await setup(adminUser, adminPassword)
})

afterAll(async () => {
  await teardown()
})

describe('users', () => {
  const email = 'testusers@jest.test'
  let userToListUsers
  let queryResult

  it('rejects non-admin usage', async () => {
    userToListUsers = await models.User.create({
      email: email,
      password: '6df54g6d54g6hs6gfj46df4h6sd5f4g6ds54h6546f54h',
    }).catch(
      async () => await models.User.findOneAndDelete({ email }),
    )
    const { id, email: userEmail, role } = userToListUsers
    const usersToken = await jwt.sign(
      { id, email: userEmail, role },
      SECRET,
      {
        expiresIn: '30m',
      },
    )
    const response = await userApi
      .users(usersToken)
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )
    const result = response.data.data.users
    const code = response.data.errors.filter(
      (error) => !!error?.extensions?.code,
    )[0].extensions.code

    expect(result).toBe(null)
    expect(code).toBe('FORBIDDEN')
  })

  it('allows admin usage', async () => {
    const response = await userApi
      .users(adminToken)
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )
    queryResult = response.data.data.users
    expect(response.data.errors).toBeUndefined()
  })

  it('returns valid users', async () => {
    await models.User.findOneAndDelete({
      email: userToListUsers.email,
    })
    const user = queryResult.filter((user) => user.email === email)[0]
    expect(user.id).toBeDefined()
    expect(user.email).toBe(email)
    expect(user.role).toBe('USER')
  })
})
