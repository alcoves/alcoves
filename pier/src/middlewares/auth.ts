import jwt from 'jsonwebtoken'
import { userInfo } from 'os'
import db from '../config/db'

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.sendStatus(403)

  const token = authHeader.split('Bearer ')[1]
  if (!token) return res.sendStatus(403)

  const user = jwt.decode(token)
  req.user = user

  next()
}

export const adminAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.sendStatus(403)

  const token = authHeader.split('Bearer ')[1]
  if (!token) return res.sendStatus(403)

  const jwtUser: any = jwt.decode(token)

  const user = await db.user.findUnique({
    where: { id: jwtUser?.id },
  })

  if (user?.isAdmin) {
    req.user = jwtUser
    return next()
  }

  return res.sendStatus(403)
}
