import { getSession } from 'next-auth/client'
import db from '../../../../../utils/db'

// Returns videos for a given user
// Ensures that users cannot query for unlisted videos
export default async function handler(req, res) {
  try {
    const session = await getSession({ req })
    if (req.method === 'GET') {
      const { visibility } = req.query

      // Anon user and or non-author user
      if (!session || req.query.id != session.id) {
        const videos = await db.video.findMany({
          where: { userId: req.query.id, visibility: 'public' },
          orderBy: { createdAt: 'desc' },
        })
        return res.send(videos)
      }

      if (visibility) {
        const videos = await db.video.findMany({
          where: { userId: req.query.id, visibility },
          orderBy: { createdAt: 'desc' },
        })
        return res.send(videos)
      }

      const videos = await db.video.findMany({
        where: { userId: req.query.id },
        orderBy: { createdAt: 'desc' },
      })
      res.send(videos)
    }
  } catch (error) {
    console.error(error)
    res.status(500).end()
  }
}
