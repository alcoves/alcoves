import db from '../config/db'
import { dispatchJob } from '../service/tidal'
import { parseFramerate } from '../service/videos'
import { archiveBucket, cdnBucket } from '../config/s3'

// This endpoint does not use cursors and could get very slow
// Currently used for the admin UI
export async function listVideos(req, res) {
  const videos = await db.video.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return res.json({ payload: videos })
}

export async function reprocessVideo(req, res) {
  const { videoId } = req.params
  const video = await db.video.findUnique({ where: { id: videoId } })
  if (!video) return res.sendStatus(400)

  await dispatchJob('/videos/thumbnails', {
    width: 854,
    height: 480,
    fit: 'cover',
    assetId: video.id,
    input: `s3://${archiveBucket}/${video.archivePath}`,
    output: `s3://${cdnBucket}/v/${video.id}/thumbnail.webp`,
  })

  const transcodeRes = await dispatchJob('/videos/transcodes/adaptive', {
    assetId: video.id,
    output: `s3://${cdnBucket}/v/${video.id}`,
    input: `s3://${archiveBucket}/${video.archivePath}`,
  })

  const width = transcodeRes?.data?.metadata?.video[0]?.width || 0
  const height = transcodeRes?.data?.metadata?.video[0]?.height || 0
  const length = parseFloat(transcodeRes?.data?.metadata?.format?.duration || 0)
  const framerate = parseFramerate(transcodeRes?.data?.metadata?.video[0]?.r_frame_rate || 0)

  await db.video.update({
    where: { id: video.id },
    data: {
      progress: 0,
      status: 'PROCESSING',
      width,
      height,
      length,
      framerate,
      metadata: transcodeRes?.data?.metadata || {},
    },
  })

  return res.sendStatus(200)
}
