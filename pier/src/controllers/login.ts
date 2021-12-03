import bcrypt from 'bcrypt'
import db from '../config/db'
import { getToken } from '../config/utils'

export async function loginController(req, res) {
  const { email, password } = req.body

  const user = await db.user.findUnique({ where: { email } })
  if (!user) return res.status(401).send('email or password incorrect')

  const compare = await bcrypt.compare(password, user.password)
  if (!compare) return res.status(401).send('email or password incorrect')

  return res.status(200).send({
    accessToken: getToken(user.id, user.email, user.username),
  })
}
