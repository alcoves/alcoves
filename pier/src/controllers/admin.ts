import db from '../config/db'
import { tidalVideoCreate } from '../service/tidal'

// This endpoint does not use cursors and could get very slow
// Currently used for the admin UI
export async function listVideos(req, res) {
  const videos = await db.video.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return res.json({ payload: videos })
}

export async function reprocessVideos(req, res) {
  const videos = await db.video.findMany()

  // for (const v of videos) {
  //   if (v.status === 'ERROR') {
  //     await dispatchJob('/videos/transcodes/adaptive', {
  //       assetId: v.id,
  //       output: `s3://${cdnBucket}/v/${v.id}`,
  //       input: `s3://${archiveBucket}/${v.archivePath}`,
  //     }).catch(error => {
  //       console.error(error)
  //     })
  //   }
  // }

  // for (const v of videos) {
  //   if (!v.thumbnailUrl) {
  //     await dispatchJob('/videos/thumbnails', {
  //       width: 854,
  //       height: 480,
  //       fit: 'cover',
  //       assetId: v.id,
  //       input: `s3://${archiveBucket}/${v.archivePath}`,
  //       output: `s3://${cdnBucket}/v/${v.id}/thumbnail.webp`,
  //     })
  //   }
  // }

  return res.status(200).json({
    videos: videos.length,
    withoutThumbnail: videos.filter(v => !v.thumbnailUrl).length,
    errored: videos.filter(v => v.status === 'ERROR').length,
    processing: videos.filter(v => v.status === 'PROCESSING').length,
    ready: videos.filter(v => v.status === 'READY').length,
  })
}

export async function reprocessVideo(req, res) {
  const { videoId } = req.params
  const video = await db.video.findUnique({ where: { id: videoId } })
  if (!video) return res.sendStatus(400)

  await tidalVideoCreate(video)

  await db.video.update({
    where: { id: video.id },
    data: {
      progress: 0,
      status: 'PROCESSING',
    },
  })

  return res.sendStatus(202)
}
