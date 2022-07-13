import jwt from 'jsonwebtoken'
import db from '../config/db'

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(403).end()

  const token = authHeader.split('Bearer ')[1]
  if (!token) return res.status(403).end()

  const user = jwt.decode(token)
  req.user = user

  next()
}

export const adminAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(403).end()

  const token = authHeader.split('Bearer ')[1]
  if (!token) return res.status(403).end()

  const jwtUser: any = jwt.decode(token)

  const user = await db.user.findUnique({
    where: { id: jwtUser?.id },
  })

  if (user?.isAdmin) {
    req.user = jwtUser
    return next()
  }

  return res.status(403).end()
}
