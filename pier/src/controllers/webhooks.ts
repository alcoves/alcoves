import db from '../config/db'
import { io } from '../index'
import { s3URI } from '../config/s3'
import { TidalWebhookBody } from '../types'
import { purgeURL } from '../service/bunny'
import { discordWebHook } from '../service/discord'
import { parseDimensions } from '../service/tidal'
import { parseFramerate } from '../service/videos'

const TIDAL_API_KEY = process.env.TIDAL_API_KEY

export async function recieveTidalWebhook(req, res) {
  const { id, name, returnValue, data, queueName, progress, state }: TidalWebhookBody = req.body
  const assetId = data?.assetId
  console.log(
    `Processing Webhook :: ${queueName} :: ${name} :: ${id} :: ${progress} :: assetId:${assetId}`
  )

  const requestApiKey = req.headers['x-api-key']
  if (requestApiKey !== TIDAL_API_KEY) return res.status(401).end

  switch (queueName) {
    case 'metadata':
      if (state === 'completed') {
        const { width, height } = parseDimensions(returnValue.metadata)
        const length = parseFloat(returnValue.metadata?.format?.duration || 0)
        const framerate = parseFramerate(returnValue.metadata?.video[0]?.r_frame_rate || 0)

        await db.video
          .update({
            where: { id: assetId },
            data: {
              width,
              height,
              length,
              framerate,
              metadata: returnValue.metadata || {},
            },
          })
          .then(video => {
            io.to(video.userId).emit('videos.update', video)
          })
      }
      break
    case 'adaptiveTranscode':
      if (state === 'completed') {
        const cdnUrl = `https://${process.env.CDN_HOSTNAME}/${s3URI(data.output).Key}`
        await purgeURL(cdnUrl)

        await db.video
          .update({
            where: { id: assetId },
            data: {
              cdnUrl,
              progress,
              status: 'READY',
            },
          })
          .then(video => {
            io.to(video.userId).emit('videos.update', video)
            discordWebHook(`https://bken.io/v/${video.id}`).catch(error => {
              console.error(error)
            })
          })
      } else if (state === 'failed') {
        await db.video
          .update({
            where: { id: assetId },
            data: { progress, status: 'ERROR' },
          })
          .then(video => {
            io.to(video.userId).emit('videos.update', video)
            discordWebHook(`FAILED :: https://bken.io/v/${video.id}`).catch(error => {
              console.error(error)
            })
          })
      } else {
        const video = await db.video.findFirst({ where: { id: assetId } })
        if (video && video?.status !== 'READY' && progress > video.progress) {
          await db.video
            .update({
              where: { id: assetId },
              data: { progress },
            })
            .then(video => {
              io.to(video.userId).emit('videos.update', video)
            })
        }
      }
      break
    case 'thumbnail':
      if (state === 'completed') {
        const thumbnailUrl = `https://${process.env.CDN_HOSTNAME}/${s3URI(data.output).Key}`
        await purgeURL(thumbnailUrl)

        await db.video
          .update({
            where: { id: assetId },
            data: { thumbnailUrl },
          })
          .then(video => {
            io.to(video.userId).emit('videos.update', video)
          })
      } else if (state === 'failed') {
        await db.video
          .update({
            where: { id: assetId },
            data: { thumbnailUrl: '' }, // set back to default thumb
          })
          .then(video => {
            io.to(video.userId).emit('videos.update', video)
          })
      }
      break
    default:
      break
  }

  return res.status(200).end
}
