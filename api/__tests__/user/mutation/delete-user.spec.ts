import { setup, teardown, env } from '../env'

let adminToken
const adminEmail = 'deleteuseradmin@jest.test'
const adminPassword =
  '6454y86er4h6s5er4g65sf4th6s4h6s4h65ad4efh6s54dfh6s5d4h65ed4h'
const { SECRET, models, userApi, jwt } = env

beforeAll(async () => {
  adminToken = await setup(adminEmail, adminPassword)
})

afterAll(async () => {
  await teardown()
})

describe('deleteUser', () => {
  const email = 'testdelete@jest.test'
  let userToDelete

  it('rejects non-admin usage', async () => {
    userToDelete = await models.User.create({
      email: email,
      password: '6df54g6d54g6hs6gfj46df4h6sd5f4g6ds54h6546f54h',
    }).catch(
      async () => await models.User.findOneAndDelete({ email }),
    )
    const { id, email: userEmail, role } = userToDelete
    const token = await jwt.sign(
      { id, email: userEmail, role },
      SECRET,
      {
        expiresIn: '30m',
      },
    )
    const response = await userApi
      .deleteUser(
        {
          id: userToDelete.id,
        },
        token,
      )
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )
    const result = response.data
    const code = result.errors.filter(
      (error) => !!error?.extensions?.code,
    )[0].extensions.code

    expect(result.data).toBe(null)
    expect(code).toBe('FORBIDDEN')
  })

  it('allows admin usage', async () => {
    const response = await userApi
      .deleteUser(
        {
          id: userToDelete.id,
        },
        adminToken,
      )
      .catch((err) =>
        console.error(err?.response?.data || err?.response || err),
      )
    const result = response.data.data.deleteUser
    expect(result).toBe(true)
  })

  it('removes user from the db', async () => {
    const query = await models.User.findById(userToDelete.id)
    expect(query).toBe(null)
  })
})
