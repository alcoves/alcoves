import bcrypt from 'bcrypt'
import db from '../config/db'
import { getToken } from '../config/utils'

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

  const pod = await db.pod.create({
    data: { name: `${user.username}'s Pod`, isDefault: true },
  })
  await db.membership.create({
    data: { role: 'OWNER', userId: user.id, podId: pod.id },
  })

  return res.json({
    accessToken: getToken(user.id, user.email, user.username, user.image || ''),
  })
}
