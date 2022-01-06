import bcrypt from 'bcrypt'
import db from '../config/db'
import { getToken } from '../config/utils'

import { OAuth2Client, TokenPayload } from 'google-auth-library'
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export async function loginGoogleSso(req, res) {
  const { token } = req.body
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  })

  const { name, email, picture } = ticket.getPayload() as TokenPayload
  if (!name || !email || !picture) return res.sendStatus(400)

  const user = await db.user.upsert({
    where: { email: email },
    update: { username: name, image: picture },
    create: { username: name, email, image: picture },
  })

  await db.library.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  })

  return res.json({
    accessToken: getToken(user.id, user.email, user.username, user.image || ''),
  })
}

export async function login(req, res) {
  const { email, password } = req.body

  const user = await db.user.findUnique({ where: { email } })
  if (!user) return res.status(401).send('email or password incorrect')

  if (!user.password) return res.sendStatus(400)

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
