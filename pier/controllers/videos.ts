import { Types } from 'mongoose'
import { Video } from '../models/models'
import { createAsset, deleteAsset } from '../lib/tidal'
import { Request, Response } from 'express'
import s3, { getSignedURL } from '../lib/s3'

interface Multipart {
  ETag: string
  PartNumber: number
}

interface CreateVideoInput {
  key: string
  parts: Multipart[]
  uploadId: string
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

export async function getVideoById(req: Request, res: Response) {
  const video = await Video.findOne({
    _id: new Types.ObjectId(req.params.videoId),
  }).populate('owner')
  if (video) return res.json({ data: video })
  return res.sendStatus(404)
}

export async function createVideo(req: Request, res: Response) {
  const { key, uploadId, parts, title = "New Upload" }: CreateVideoInput = req.body
  const { videoId, podId } = req.params

  await s3.completeMultipartUpload({
    Key: key,
    UploadId: uploadId,
    Bucket: 'cdn.bken.io',
    MultipartUpload: { Parts: parts },
  }).promise();

  const signedUrl = await getSignedURL({
    Bucket: 'cdn.bken.io',
    Key: getSourceVideoURI(videoId)
  })

  const asset = await createAsset(signedUrl)
  const video = await Video.findOneAndUpdate({
    _id: new Types.ObjectId(videoId),
  }, {
    _id: new Types.ObjectId(videoId),
    title,
    pod: podId,
    tidal: asset._id,
    owner: req.userId,
    status: 'processing',
  }, {
    new: true,
    upsert: true
  })

  return res.json(video)
}

export async function createUploadUrl(req: Request, res: Response) {
  const videoId = new Types.ObjectId()
  const { chunks } = req.body

  const { UploadId, Key } = await s3.createMultipartUpload({
    Bucket: 'cdn.bken.io',
    // ContentType: type,
    Key: `source/${videoId}/original`,
  }).promise();

  const urls = [];
  for (let i = 1; i <= chunks; i++) {
    urls.push(
      s3.getSignedUrl('uploadPart', {
        Key,
        UploadId,
        PartNumber: i,
        Expires: 43200,
        Bucket: 'cdn.bken.io',
      })
    );
  }

  return res.json({ data: {
    urls,
    key: Key,
    _id: videoId,
    uploadId: UploadId,
  }
})
}

export async function deleteVideoById(req: Request, res: Response) {
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

// export async function patchVideoById(req: Request, res: Response) {
//   const { value, error } = validateSchema('patchVideoById', req.body)
//   if (error) return res.status(400).send(error)

//   const video = await Video.findOneAndUpdate({ _id: req.params.videoId, owner: req.userId }, {
//     ...value
//   })
  
//   if (video) return res.status(200).end()
//   return res.status(400)
// }