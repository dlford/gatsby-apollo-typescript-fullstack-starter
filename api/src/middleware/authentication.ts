import models from '../models'
import * as jwt from 'jsonwebtoken'

type Credentials = {
  email: string
  password: string
}

const secret = process.env.SECRET || 'secret-stub'
const sessionSecret =
  process.env.SESSION_SECRET || 'session-secret-stub'

export default async (req, res): Promise<void> => {
  try {
    const { email: authEmail, password } = req.body as Credentials

    if (!authEmail || !password) {
      res.sendStatus(403)
      return
    }

    const user = await models.User.findOne({ email: authEmail })

    const isValidPassword = await user.validatePassword(password)

    if (!isValidPassword) {
      res.sendStatus(401)
      return
    }

    const { useragent, ip } = req
    const session = await new models.Session({
      useragent,
      ip,
    })

    const accessToken = await jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      secret,
      { expiresIn: '15m' },
    )

    const sessionToken = await jwt.sign(
      {
        id: session.id,
        iat: session.iat,
        exp: session.exp,
      },
      sessionSecret,
    )

    res.cookie('session_id', session.id, {
      domain: 'localhost', // TODO
      httpOnly: true,
      maxAge: 3600, // TODO
      path: '/',
      sameSite: true,
      secure: false, // TODO
    })

    res.cookie('session', sessionToken, {
      domain: 'localhost', // TODO
      httpOnly: true,
      maxAge: 3600, // TODO
      path: '/',
      sameSite: true,
      secure: false, // TODO
    })

    res.status(200).json({ token: accessToken })
    return
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
    return
  }
}
