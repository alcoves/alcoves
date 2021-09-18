import s3 from '../lib/s3'
import mongoose from 'mongoose'
import { Video } from '../lib/models'
import { Request, Response } from 'express'
interface CreateVideoInput {
  title: string
  duration: number
}

export async function listVideos(req: Request, res: Response) {
  const videos = await Video.find({
    pod: new mongoose.Types.ObjectId(req.params.podId),
  }).populate("owner")
  return res.json({ data: videos  })
}

export async function getVideo(req: Request, res: Response) {
  const video = await Video.findOne({
    _id:  new mongoose.Types.ObjectId(req.params.videoId),
    pod: new mongoose.Types.ObjectId(req.params.podId),
  })
  if (video) return res.json({ data: video })
  return res.sendStatus(404)
}

export async function createVideo(req: Request, res: Response) {
  const createVideoInput: CreateVideoInput = req.body

  const video = await new Video({
    _id: new mongoose.Types.ObjectId(),
    status: 'uploading',
    title: createVideoInput.title,
    duration: createVideoInput.duration,
    views: 0,
    pod: req.params.podId,
    owner: req.userId,
  }).save()

  const signedUploadUrl = await s3.getSignedUrlPromise('putObject', {
    Bucket: 'cdn.bken.io',
    Key: `v/${video._id}/original`
  })

  return res.json({ data: signedUploadUrl })
}