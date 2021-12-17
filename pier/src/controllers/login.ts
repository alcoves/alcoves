import bcrypt from 'bcrypt'
import db from '../config/db'
import { getToken } from '../config/utils'

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
