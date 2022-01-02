import bcrypt from 'bcrypt'
import db from '../config/db'
import { getToken } from '../config/utils'

export function root(req, res) {
  return res.sendStatus(200)
}

export async function login(req, res) {
  const { email, password } = req.body

  const user = await db.user.findUnique({ where: { email } })
  if (!user) return res.status(401).send('email or password incorrect')

  const compare = await bcrypt.compare(password, user.password)
  if (!compare) return res.status(401).send('email or password incorrect')

  return res.json({
    accessToken: getToken(user.id, user.email, user.username, user.image || ''),
  })
}

export async function register(req, res) {
  const { email, username, password } = req.body

  const userExists = await db.user.findUnique({ where: { email } })
  if (userExists) return res.status(400).end()

  const user = await db.user.create({
    data: {
      email,
      username,
      password: await bcrypt.hash(password, 10),
    },
  })

  await db.library.create({
    data: { userId: user.id },
  })

  return res.json({
    accessToken: getToken(user.id, user.email, user.username, user.image || ''),
  })
}
