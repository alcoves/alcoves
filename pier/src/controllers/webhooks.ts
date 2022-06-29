import db from '../config/db'
import { io } from '../index'
import { TidalWebhookBody } from '../types'
import { defaultBucket } from '../config/s3'
import { dispatchJob } from '../service/tidal'
import { parseFramerate } from '../service/videos'
import { discordWebHook } from '../service/discord'

const TIDAL_API_KEY = process.env.TIDAL_API_KEY

export async function recieveTidalWebhook(req, res) {
  const { id, name, data, returnValue, queueName, progress, state }: TidalWebhookBody = req.body
  const assetId = data?.assetId
  console.log(
    `Processing Webhook :: ${queueName} :: ${name} :: ${id} :: ${progress} :: assetId:${assetId}`
  )

  const requestApiKey = req.headers['x-api-key']
  if (requestApiKey !== TIDAL_API_KEY) return res.sendStatus(401)

  switch (queueName) {
    case 'publish':
      if (state === 'completed') {
        await db.video
          .update({
            where: { id: assetId },
            data: {
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
      }
      break
    case 'import':
      if (state === 'completed') {
        const width = returnValue?.metadata?.video[0]?.width
        const height = returnValue?.metadata?.video[0]?.height
        const length = parseFloat(returnValue?.metadata?.format?.duration || 0)
        const framerate = parseFramerate(returnValue?.metadata?.video[0]?.r_frame_rate || 0)

        await db.video
          .update({
            where: { id: assetId },
            data: { width, height, length, framerate },
          })
          .then(video => {
            io.to(video.userId).emit('videos.update', video)
          })
      } else if (state === 'failed') {
        await db.video
          .update({
            where: { id: assetId },
            data: { status: 'ERROR' },
          })
          .then(video => {
            io.to(video.userId).emit('videos.update', video)
          })
      }
      break
    case 'thumbnail':
      if (state === 'completed') {
        // await db.video
        //   .update({
        //     where: { id: assetId },
        //     data: { thumbnail: '' },
        //   })
        //   .then(video => {
        //     io.to(video.userId).emit('videos.update', video)
        //   })
      } else if (state === 'failed') {
        // await db.video
        // .update({
        //   where: { id: assetId },
        //   data: { thumbnail: '' },
        // })
        // .then(video => {
        //   io.to(video.userId).emit('videos.update', video)
        // })
      }
      break
    default:
      break
  }

  return res.sendStatus(200)
}
