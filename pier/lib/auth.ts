import { Request, Response, NextFunction } from "express"
import { query } from "../config/db"

export async function auth(req: Request, res: Response, next: NextFunction) {
  const apiKey = req?.headers['x-api-key']
  if (apiKey) {
    const command = `select id from users where api_key = $1`
    const { rows } = await query(command, [apiKey])
    if (rows[0]?.id) {
      // @ts-ignore
      req.currentUser = rows[0].id
      next()
    } else {
      res.sendStatus(401)
    }
  } else {
    return res.sendStatus(401)
  }
}