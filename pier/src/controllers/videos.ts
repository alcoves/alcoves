import db from '../config/db'
import { Request, Response } from 'express'

export async function get(req: Request, res: Response) {
  const query = `select * from videos where id = $1` 
  const { rows } = await db.query(query, [req.params.id])
  if (rows?.length) {
    return res.status(200).json(rows[0])
  } else {
    return res.sendStatus(404)
  }
}