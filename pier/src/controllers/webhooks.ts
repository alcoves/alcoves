import db from '../config/db'
import { io } from '../index'
import { TidalWebhookBody } from '../types'
import { defaultBucket } from '../config/s3'
import { dispatchJob } from '../service/tidal'
import { parseFramerate } from '../service/videos'
import { discordWebHook } from '../service/discord'

const TIDAL_API_KEY = process.env.TIDAL_API_KEY

export async function recieveTidalWebhook(req, res) {
  const { id, name, data, returnValue, queueName, progress, isFailed }: TidalWebhookBody = req.body
  console.log(`Processing Webhook :: ${queueName}:${name}:${id}`)

  const requestApiKey = req.headers['x-api-key']
  if (requestApiKey !== TIDAL_API_KEY) return res.sendStatus(401)

  switch (name) {
    case 'metadata':
      await db.video
        .update({
          where: { id: data.entityId },
          data: {
            status: 'PROCESSING',
            width: returnValue.video.width,
            height: returnValue.video.height,
            framerate: parseFramerate(returnValue.video.r_frame_rate),
            length: returnValue.format.duration || returnValue.video.duration || 0,
          },
        })
        .then(video => {
          io.to(video.userId).emit('videos.update', video)
        })

      await dispatchJob('thumbnail', {
        entityId: data.entityId,
        input: {
          bucket: defaultBucket,
          key: `v/${data.entityId}/original`,
        },
        output: {
          bucket: defaultBucket,
          key: `v/${data.entityId}/thumbnail.jpg`,
        },
      })

      await dispatchJob('transcode/hls', {
        entityId: data.entityId,
        input: {
          bucket: defaultBucket,
          key: `v/${data.entityId}/original`,
        },
        output: {
          bucket: defaultBucket,
          path: `v/${data.entityId}/hls`,
        },
      })

      return res.sendStatus(200)
    case 'thumbnail':
      // The thumbnail was successfully processed
      return res.sendStatus(200)
    case 'package-hls':
      if (isFailed) {
        await db.video
          .update({
            where: { id: data.entityId },
            data: {
              progress,
              status: 'ERROR',
            },
          })
          .then(video => {
            io.to(video.userId).emit('videos.update', video)
            discordWebHook(`FAILED :: https://bken.io/v/${video.id}`).catch(error => {
              console.error(error)
            })
          })
      } else {
        await db.video
          .update({
            where: { id: data.entityId },
            data: {
              progress,
              status: progress === 100 ? 'READY' : 'PROCESSING',
            },
          })
          .then(video => {
            io.to(video.userId).emit('videos.update', video)
            // Tidal fires two events with progress equals 100, we want the last one
            const videoDoneEventFired = video.status === 'READY' && returnValue
            if (videoDoneEventFired) {
              discordWebHook(`https://bken.io/v/${video.id}`).catch(error => {
                console.error(error)
              })
            }
          })
      }

      return res.sendStatus(200)
    default:
      console.error('Unknown webhook event')
      return res.sendStatus(200)
  }
}
