import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.sendStatus(403)

  const token = authHeader.split('Bearer ')[1]
  if (!token) return res.sendStatus(403)

  const user = jwt.decode(token)
  req.user = user

  next()
}
