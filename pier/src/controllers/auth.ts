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
