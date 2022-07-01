import db from '../config/db'
import { archiveBucket, cdnBucket } from '../config/s3'
import { dispatchJob } from '../service/tidal'

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
    input: `doco:${archiveBucket}/${video.archivePath}`,
    output: `doco:${cdnBucket}/v/${video.id}/thumbnail.webp`,
  })

  await dispatchJob('/videos', {
    assetId: video.id,
    output: `doco:${cdnBucket}/v/${video.id}`,
    input: `doco:${archiveBucket}/${video.archivePath}`,
  })

  return res.sendStatus(200)
}
