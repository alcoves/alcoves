import { v4 as uuid } from 'uuid'
import { db } from '../config/db'
import { TranscodeJobData } from '../types'
import { flowProducer } from '../queues/flow'
import s3, { deleteFolder, getVideoSourceLocation, parseS3Uri } from '../lib/s3'

export async function createVideoUploadLink(req, res) {
  const videoId = uuid()
  const videoFileId = uuid()

  const videoLocation = getVideoSourceLocation(videoId)
  const videoFileInputLocation = `${videoLocation}/files/${videoFileId}`
  const presignedPutRequest = await s3.getSignedUrlPromise('putObject', {
    Key: parseS3Uri(videoFileInputLocation).Key,
    Bucket: parseS3Uri(videoFileInputLocation).Bucket,
  })

  await db.video.create({
    data: {
      id: videoId,
      location: videoLocation,
      files: {
        create: {
          type: 'ORIGINAL',
          id: videoFileId,
          location: videoFileInputLocation,
        },
      },
    },
  })

  return res.json({
    videoId,
    link: presignedPutRequest,
  })
}

export async function deleteVideo(req, res) {
  const video = await db.video.findUnique({
    where: { id: req.params.videoId },
  })

  if (!video) return res.sendStatus(400)
  await deleteFolder(video.location)
  await db.video.delete({
    where: { id: req.params.videoId },
  })

  res.sendStatus(200)
}

export async function getVideo(req, res) {
  const videos = await db.video.findMany({
    orderBy: { createdAt: 'desc' },
    where: { id: req.params.videoId },
    include: {
      files: {
        orderBy: { type: 'asc' },
      },
      // thumbnails: {
      //   orderBy: { createdAt: 'desc' },
      // },
      packages: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })
  if (videos.length) return res.json(videos[0])
  return res.sendStatus(404)
}

export async function listVideos(req, res) {
  const videos = await db.video.findMany({
    orderBy: { createdAt: 'desc' },
    // include: {
    //   thumbnails: {
    //     orderBy: { createdAt: 'desc' },
    //   },
    // },
  })
  res.json({ videos })
}

export async function startVideoProcessing(req, res) {
  const { videoId } = req.params

  const video = await db.video.findUnique({
    where: { id: videoId },
    include: {
      files: {
        where: {
          type: 'ORIGINAL',
        },
      },
    },
  })
  if (!video) return res.sendStatus(404)
  if (!video.files.length) return res.sendStatus(400)

  const originalVideoFile = video.files[0]

  await db.videoFile.update({
    where: { id: originalVideoFile.id },
    data: {
      status: 'READY',
    },
  })

  const packageId = uuid()

  const fileId1 = uuid()
  const fileId2 = uuid()

  const videoTranscode: TranscodeJobData = {
    videoId,
    videoFileId: fileId1,
    cmd: `c:v libsvtav1 -crf 40 -preset 8 -c:a libopus -ac 2 -b:a 128k -filter:v scale='min(1280,iw)':min'(720,ih)':force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2`,
    input: originalVideoFile.location,
    output: `${video.location}/files/${fileId1}/${fileId1}.mkv`,
  }

  const audioTranscode: TranscodeJobData = {
    videoId,
    videoFileId: uuid(),
    cmd: `-vn -c:a libopus -ac 2 -b:a 128k`,
    outputFilename: 'output.ogg',
    input: originalVideoFile.location,
    output: `${video.location}/files/${packageId}`,
  }

  await flowProducer.add({
    name: 'packaging',
    queueName: 'packaging',
    data: {
      videoId,
      inputs: [],
    },
    children: [
      {
        queueName: 'transcode',
        name: 'v_1',
        data: videoTranscode,
      },
      {
        queueName: 'transcode',
        name: 'a_1',
        data: audioTranscode,
      },
    ],
  })

  return res.status(202).end()
}

// export async function createThumbnail(req, res) {
//   const { videoId } = req.params

//   const schema = Joi.object({
//     time: Joi.string().default('00:00:00:000'),
//     width: Joi.number().default(854).min(1).max(10000).required(),
//     height: Joi.number().default(400).min(1).max(10000).required(),
//     fit: Joi.string().uri().default('cover').valid('cover', 'contain', 'fill', 'inside', 'outside'),
//   })

//   const { error, value } = schema.validate(req.body, {
//     abortEarly: false, // include all errors
//     allowUnknown: true, // ignore unknown props
//     stripUnknown: true, // remove unknown props
//   })
//   if (error) return res.status(400).json(error)

//   await enqueueThumbnailJob(videoId, {
//     fit: value.fit,
//     time: value.time,
//     width: value.width,
//     height: value.height,
//   })

//   return res.status(202).end()
// }
