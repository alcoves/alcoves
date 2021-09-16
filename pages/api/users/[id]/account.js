import { getSession } from 'next-auth/react'
import db from '../../../../utils/db'
import { listObjects } from '../../../../utils/s3'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const session = await getSession({ req })
      if (!session) return res.status(403).end()
      const user = await db.user.findFirst({ where: { id: req.query.id } })

      if (session.id === user.id) {
        const videos = await db.video.findMany({ where: { userId: user.id } })
        const totals = videos.reduce(
          (acc, cv) => {
            acc.totalVideos++
            acc.totalViews += cv.views
            acc.totalDuration += parseFloat(cv.duration)
            return acc
          },
          {
            totalDuration: 0,
            totalViews: 0,
            totalVideos: 0,
          }
        )

        const allObjects = await Promise.all(
          videos.map(v => {
            return listObjects({
              Bucket: 'cdn.bken.io',
              Prefix: `v/${v.id}`,
            })
          })
        )

        const totalBytesStored = allObjects.reduce((acc, cv) => {
          cv.map(({ Size }) => {
            acc += Size
          })
          return acc
        }, 0)

        return res.json({
          ...totals,
          totalBytesStored,
        })
      }

      return res.status(400).end()
    }
    res.status(400).end()
  } catch (error) {
    console.error(error)
    return res.status(500).end()
  }
}
