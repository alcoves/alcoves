import  { Types } from 'mongoose'
import { Pod, Video } from '../models/models'
import { Request, Response } from 'express'

interface CreatePodInput {
  name: string
}

interface PatchPodInput {
  name: string
}

export async function listPods(req: Request, res: Response) {
  const pods = await Pod.find({ members: new Types.ObjectId(req.userId) })
  return res.json({ data: pods  })
}

export async function createPod(req: Request, res: Response) {
  const createPodInput: CreatePodInput = req.body
  await new Pod({
    _id: new Types.ObjectId(),
    name: createPodInput.name,
    owner: req.userId,
    members: [req.userId]
  }).save()
  return res.sendStatus(201)
}

export async function getPodById(req: Request, res: Response) {
  const filter = {
    _id: new Types.ObjectId(req.params.podId),
  }
  const pod = await Pod.findOne(filter).populate('members')
  if (pod) return res.json({ data: pod })
  return res.sendStatus(404)
}

export async function patchPodById(req: Request, res: Response) {
  const filter = {
    _id: new Types.ObjectId(req.params.podId),
    owner: new Types.ObjectId(req.userId)
  }
  const patchPodInput: PatchPodInput = req.body
  const patch = await Pod.findOneAndUpdate(filter, {
    ...patchPodInput
  })
  if (patch) return res.sendStatus(200)
  return res.sendStatus(400)
}

export async function deletePodById(req: Request, res: Response) {
  const filter = {
    _id: new Types.ObjectId(req.params.podId),
    owner: new Types.ObjectId(req.userId)
  }
  const podVideo = await Video.findOne({ pod: new Types.ObjectId(req.params.podId) })
  console.log("podVideo", podVideo)
  if (!podVideo) {
    const deleted = await Pod.findOneAndRemove(filter)
    if (deleted) return res.sendStatus(200)
  }
  return res.sendStatus(400)
}