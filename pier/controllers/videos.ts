import s3, { deleteFolder, getSignedURL } from '../lib/s3'
import mongoose from 'mongoose'
import { Job, Video } from '../lib/models'
import { Request, Response } from 'express'
import { getMetadata } from '../lib/video/getMetadata'
import { getTranscodingJobs, getThumbnailJobs, getPackagingJobs } from '../lib/video/getJobs'
interface CreateVideoInput {
  title: string
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
  })
  if (video) return res.json({ data: video })
  return res.sendStatus(404)
}

export async function createVideo(req: Request, res: Response) {
  const createVideoInput: CreateVideoInput = req.body
  const sourceURI = `cdn.bken.io/v/${req.params.videoId}/original`
  const signedUrl = await getSignedURL(sourceURI)
  const metadata = await getMetadata(signedUrl)

  const thumbnailJobs = getThumbnailJobs(metadata, req.params.videoId, signedUrl)
  const transcodeJobs = getTranscodingJobs(metadata, req.params.videoId, signedUrl)
  const packagingJobs = getPackagingJobs(req.params.videoId)

  await Job.insertMany([
    ...thumbnailJobs,
    ...transcodeJobs,
    ...packagingJobs
  ])

  const video = await Video.findOneAndUpdate({
    _id: new mongoose.Types.ObjectId(req.params.videoId),
  }, {
    _id: new mongoose.Types.ObjectId(req.params.videoId),
    status: 'uploaded',
    title: createVideoInput?.title || "New Upload",
    duration: metadata.format.duration,
    source: sourceURI,
    hlsUrl: `https://cdn.bken.io/v/${req.params.videoId}/pkg/master.m3u8`,
    mpdUrl: `https://cdn.bken.io/v/${req.params.videoId}/pkg/stream.mpd`,
    thumbnailUrl: `https://cdn.bken.io/v/${req.params.videoId}/thumb.jpg`,
    pod: req.params.podId,
    owner: req.userId,
  }, {
    new: true,
    upsert: true
  })
  return res.json(video)
}

export async function createUploadUrl(req: Request, res: Response) {
  const videoId = new mongoose.Types.ObjectId()
  const signedUploadUrl = await s3.getSignedUrlPromise('putObject', {
    Bucket: 'cdn.bken.io',
    Key: `v/${videoId}/original`
  })
  return res.json({ data: { _id: videoId, url: signedUploadUrl } })
}

export async function deleteVideo(req: Request, res: Response) {
  const video = await Video.findOne({
    _id: req.params.videoId,
    owner: req.userId
  })

  // Double check that video._id is not null
  // If null, entire s3 prefix could be wiped
  if (video && video._id) {
    await deleteFolder({
      Bucket: 'cdn.bken.io',
      Prefix: `v/${video._id}`,
    })
    await Video.findByIdAndDelete(video._id)
    return res.sendStatus(200)
  }
  return res.sendStatus(403)
}
