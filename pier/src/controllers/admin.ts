import db from '../config/db'
import { defaultBucket } from '../config/s3'
import { dispatchJob } from '../service/tidal'

export async function reprocessVideos(req, res) {
  const videos = await db.video.findMany({ where: { status: 'READY' } })

  for (const video of videos) {
    const key = `v/${video.id}/original`
    await dispatchJob('metadata', {
      entityId: video.id,
      input: {
        key,
        bucket: defaultBucket,
      },
    })
  }

  return res.json({
    videoCount: videos.length,
  })
}
