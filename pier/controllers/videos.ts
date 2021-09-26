import { Types } from 'mongoose'
import { Video } from '../models/models'
import { createAsset, deleteAsset } from '../lib/tidal'
import { Request, Response } from 'express'
import s3, { getSignedURL } from '../lib/s3'

interface CreateVideoInput {
  title: string
}

function getSourceVideoURI(id: string): string {
  return `source/${id}/original`
}

export async function listVideos(req: Request, res: Response) {
  const videos = await Video.find({
    pod: new Types.ObjectId(req.params.podId),
  }).populate("owner").sort('-createdAt')
  return res.json({ data: videos  })
}

export async function getVideo(req: Request, res: Response) {
  const video = await Video.findOne({
    _id: new Types.ObjectId(req.params.videoId),
  })
  if (video) return res.json({ data: video })
  return res.sendStatus(404)
}

export async function createVideo(req: Request, res: Response) {
  const createVideoInput: CreateVideoInput = req.body
  const { videoId, podId } = req.params
  const signedUrl = await getSignedURL({
    Bucket: 'cdn.bken.io',
    Key: getSourceVideoURI(videoId)
  })

  const asset = await createAsset(signedUrl)
  const video = await Video.findOneAndUpdate({
    _id: new Types.ObjectId(videoId),
  }, {
    _id: new Types.ObjectId(videoId),
    title: createVideoInput?.title || "New Upload",
    status: 'uploading',
    tidal: asset._id,
    owner: req.userId,
    pod: podId,
  }, {
    new: true,
    upsert: true
  })

  return res.json(video)
}

export async function createUploadUrl(req: Request, res: Response) {
  const videoId = new Types.ObjectId()
  const signedUploadUrl = await s3.getSignedUrlPromise('putObject', {
    Bucket: 'cdn.bken.io',
    Key: `source/${videoId}/original`
  })
  return res.json({ data: { _id: videoId, url: signedUploadUrl } })
}

export async function deleteVideo(req: Request, res: Response) {
  const video = await Video.findOne({
    _id: req.params.videoId,
    owner: req.userId
  })

  if (video && video._id.toString() === req.params.videoId) {
    // @ts-ignore
    await deleteAsset(video.tidal)
    await s3.deleteObject({
      Bucket: 'cdn.bken.io',
      Key: getSourceVideoURI(video._id)
    }).promise()
    await Video.findByIdAndDelete(video._id)
    return res.sendStatus(200)
  }
  return res.sendStatus(403)
}
