import { query } from '../config/db'
import { Request, Response } from 'express'

export async function get(req: Request, res: Response) {
  const command = `select * from videos where id = $1` 
  const { rows } = await query(command, [req.params.id])
  if (rows?.length) {
    return res.status(200).json(rows[0])
  } else {
    return res.sendStatus(404)
  }
}

export async function list(req: Request, res: Response) {
  const command = `select * from videos`
  const { rows } = await query(command, [])
  return res.status(200).json(rows)
}