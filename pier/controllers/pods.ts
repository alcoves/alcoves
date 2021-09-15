import { connectToDatabase } from '../config/db'
import { Request, Response } from 'express'

export async function list(req: Request, res: Response) {
  const db = await connectToDatabase()
  const pods = await db.collection('pods').find({}).toArray()
  // console.log(req.headers.authorization)
  // const command = `select * from pod_memberships inner join pods p on p.id = pod_memberships.pod_id where user_id = $1`
  // // @ts-ignore
  // const { rows } = await query(command, [req.currentUser])
  // return res.status(200).json(rows)
  return res.json({ pods })
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