import Pod from '../models/pod'
import { ObjectId } from 'mongodb'
import { Request, Response } from 'express'

export async function list(req: Request, res: Response) {
  const pods = await Pod.find({ members: new ObjectId(req.userId) })
  return res.json({ data: pods  })
}

// export async function create(req: Request, res: Response) {
//   const command = `insert into pods`
//   return res.status(200).end()
// }

export async function getById(req: Request, res: Response) {
  const pod = await Pod.findById(req.params.id)
  return res.json({ data: pod })
}

// export async function patchById(req: Request, res: Response) {
//   return res.status(200).end()
// }

// export async function deleteById(req: Request, res: Response) {
//   return res.status(200).end()
// }