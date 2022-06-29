import db from '../config/db'
import { cdnBucket } from '../config/s3'
import { dispatchJob } from '../service/tidal'

// This endpoint does not use cursors and could get very slow
// Only returns videos that aren't completed
// Currently used for the admin UI
export async function listVideos(req, res) {
  const query: any = {
    orderBy: { createdAt: 'desc' },
    where: { progress: { lt: 100 } },
  }

  const videos = await db.video.findMany(query)
  return res.json({ payload: videos })
}

export async function reprocessVideo(req, res) {
  const { videoId } = req.params
  const video = await db.video.findUnique({ where: { id: videoId } })
  if (!video) return res.sendStatus(400)

  const key = `v/${video.id}/original`
  await dispatchJob('metadata', {
    entityId: video.id,
    input: { key, bucket: cdnBucket },
  })

  return res.sendStatus(200)
}

export async function reprocessVideos(req, res) {
  const videos = await db.video.findMany({ where: { status: 'READY' } })

  for (const video of videos) {
    const key = `v/${video.id}/original`
    await dispatchJob('metadata', {
      entityId: video.id,
      input: {
        key,
        bucket: cdnBucket,
      },
    })
  }

  return res.json({
    videoCount: videos.length,
  })
}
