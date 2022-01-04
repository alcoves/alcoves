import cuid from 'cuid'
import db from '../config/db'
import { TidalWebhookBody } from '../types'
import { defaultBucket } from '../config/s3'
import { dispatchJob } from '../service/tidal'
import { parseFramerate } from '../service/videos'

export async function recieveTidalWebhook(req, res) {
  const { id, name, data, returnValue, queueName, progress, isFailed }: TidalWebhookBody = req.body
  console.log(`Processing Webhook :: ${queueName}:${name}:${id}`)

  switch (name) {
    case 'metadata':
      await db.video.update({
        where: { id: data.entityId },
        data: {
          // lastJobId: id,
          status: 'READY',
          width: returnValue.video.width,
          height: returnValue.video.height,
          framerate: parseFramerate(returnValue.video.r_frame_rate),
          length: returnValue.format.duration || returnValue.video.duration || 0,
        },
      })

      await dispatchJob('thumbnail', {
        entityId: data.entityId,
        input: {
          bucket: defaultBucket,
          key: `v/${data.entityId}/original`,
        },
        output: {
          bucket: defaultBucket,
          key: `v/${data.entityId}/thumbnails/${cuid()}.jpg`,
        },
      })

      await dispatchJob('transcode', {
        entityId: data.entityId,
        input: {
          bucket: defaultBucket,
          key: `v/${data.entityId}/original`,
        },
        output: {
          bucket: defaultBucket,
          key: `v/${data.entityId}/optimized`,
        },
      })

      return res.sendStatus(200)
    case 'thumbnail':
      await db.video.update({
        where: { id: data.entityId },
        data: {
          thumbnailFilename: returnValue.thumbnailFilename,
        },
      })
      return res.sendStatus(200)
    case 'transcode':
      if (isFailed) {
        await db.video.update({
          where: { id: data.entityId },
          data: {
            progress,
            status: 'ERROR',
          },
        })
      } else {
        await db.video.update({
          where: { id: data.entityId },
          data: {
            progress,
            status: progress === 100 ? 'READY' : 'PROCESSING',
          },
        })
      }

      return res.sendStatus(200)
    default:
      console.error('Unknown webhook event')
      return res.sendStatus(400)
  }
}
