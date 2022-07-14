import db from '../config/db'
import {
  tidalVideoCreate,
  dispatchMetadataJob,
  dispatchThumbnailJob,
  dispatchTranscodeJob,
} from '../service/tidal'

// This endpoint does not use cursors and could get very slow
// Currently used for the admin UI
export async function listVideos(req, res) {
  const videos = await db.video.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return res.json({ payload: videos })
}

export async function reprocessVideos(req, res) {
  const { metadata, thumbnail, video } = req.body
  const videos = await db.video.findMany()

  if (metadata === true) {
    for (const v of videos) {
      await dispatchMetadataJob(v)
    }
  }

  if (thumbnail === true) {
    for (const v of videos) {
      await dispatchThumbnailJob(v)
    }
  }

  if (video === true) {
    for (const v of videos) {
      await dispatchTranscodeJob(v)
    }
  }

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
  if (!video) return res.status(400).end()

  await tidalVideoCreate(video)

  await db.video.update({
    where: { id: video.id },
    data: {
      progress: 0,
      status: 'PROCESSING',
    },
  })

  return res.status(202).end()
}
