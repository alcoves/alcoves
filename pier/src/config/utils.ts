import jwt from 'jsonwebtoken'

let JWT_SECRET: string

if (process.env.JWT_SECRET) {
  JWT_SECRET = process.env.JWT_SECRET
} else {
  throw new Error('process.env.JWT_SECRET must be defined!')
}

export function getToken(id: string, email: string, username: string, image: string): string {
  return jwt.sign({ id, email, username, image }, JWT_SECRET, { expiresIn: '30d' })
}
