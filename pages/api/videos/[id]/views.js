import { getSession } from 'next-auth/react'
import db from '../../../../utils/db'

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const videoId = req.query.id
      const session = await getSession({ req })
      const requestIP = req.headers['cf-connecting-ip']
      if (!requestIP) return res.status(400).send(`invalid request ip: ${requestIP}`)

      const video = await db.video.findFirst({ where: { id: videoId } })
      if (!video) return res.status(404).end()
      if (video.duration <= 0) return res.status(400).end()

      const backdatedTimestamp = new Date(Date.now() - video.duration * 1000).toISOString()
      const recentView = await db.videoView.findFirst({
        where: {
          id: videoId,
          ip: requestIP,
          createdAt: { gte: backdatedTimestamp },
        },
      })

      if (recentView) {
        return res.status(400).send('view too recent, not counted')
      }

      const newView = { ip: requestIP, videoId }
      if (session?.id) newView.userId = session.id.toString()
      await db.videoView.create({ data: newView })
      await db.video.update({
        where: { id: videoId },
        data: { views: { increment: 1 } },
      })
      return res.status(200).end()
    }
    res.status(400).end()
  } catch (error) {
    console.error(error)
    res.status(500).end()
  }
}
