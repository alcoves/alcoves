import mongoose from 'mongoose'
import { Video } from '../lib/models'
import { Request, Response } from 'express'

export async function listVideos(req: Request, res: Response) {
  const filter = {
    pod: new mongoose.Types.ObjectId(req.params.podId),
  }
  const videos = await Video.find(filter).populate("owner")
  return res.json({ data: videos  })
}

export async function getVideo(req: Request, res: Response) {
  const filter = {
    _id:  new mongoose.Types.ObjectId(req.params.videoId),
    pod: new mongoose.Types.ObjectId(req.params.podId),
  }
  const video = await Video.findOne(filter)
  if (video) return res.json({ data: video })
  return res.sendStatus(404)
}