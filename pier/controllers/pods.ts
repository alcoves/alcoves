import { ObjectId } from 'mongodb'
import { connectToDatabase } from '../config/db'
import { Request, Response } from 'express'

export async function list(req: Request, res: Response) {
  const db = await connectToDatabase()
  // @ts-ignore
  const pods = await db.collection('pods').find({ members: ObjectId(req.currentUser) }).toArray()
  return res.json({ payload: pods })
}

// export async function create(req: Request, res: Response) {
//   const command = `insert into pods`
//   return res.status(200).end()
// }

// export async function getById(req: Request, res: Response) {
//   const command = `select * from pods where id = $1` 
//   const { rows } = await query(command, [req.params.id])
//   if (rows?.length) {
//     return res.status(200).json(rows[0])
//   } else {
//     return res.sendStatus(404)
//   }
// }

// export async function patchById(req: Request, res: Response) {
//   return res.status(200).end()
// }

// export async function deleteById(req: Request, res: Response) {
//   return res.status(200).end()
// }