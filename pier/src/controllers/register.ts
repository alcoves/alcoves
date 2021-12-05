import bcrypt from 'bcrypt'
import db from '../config/db'
import { getToken } from '../config/utils'

export async function registerController(req, res) {
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

  return res.json({
    accessToken: getToken(user.id, user.email, user.username),
  })
}
