import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from "express"

export async function auth(req: Request, res: Response, next: NextFunction) {
  const apiKey = req?.headers['authorization']
  const apiToken = apiKey?.split("Bearer ")[1]

  if (apiToken) {
    const decodedToken = jwt.verify(apiToken as string, process.env.JWT_SIGNING_KEY as string)
    console.log("Decoded Token", decodedToken)
    // @ts-ignore
    req.userId = decodedToken.id
    next()
  } else {
    return res.sendStatus(401)
  }
}