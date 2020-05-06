type Credentials = {
  email: string
  password: string
}

export default function(req, res): void {
  try {
    const credentials = JSON.parse(req.body) as Credentials
    console.log(credentials)
    res.sendStatus(401)
    res.cookie('Test', 27, { httpOnly: true }).sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}
