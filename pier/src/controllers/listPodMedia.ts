import db from '../config/db'
import { Prisma } from '@prisma/client'

export async function listPodMedia(req, res) {
  const hasMembership = await db.membership.findFirst({
    where: { userId: req.user.id, podId: req.query.podId },
  })
  if (!hasMembership) return res.sendStatus(403)

  const mediaParams: Prisma.MediaReferenceFindManyArgs = {
    // take: 50,
    include: {
      media: {
        include: {
          user: {
            select: {
              id: true,
              image: true,
              username: true,
            },
          },
        },
      },
    },
    orderBy: [{ id: 'desc' }],
    where: { podId: req.query.podId },
  }

  if (req.query.before) {
    mediaParams.skip = 1
    mediaParams.orderBy = [{ id: 'desc' }]
    mediaParams.cursor = {
      id: parseInt(req.query.before),
    }
  }

  const media = await db.mediaReference.findMany(mediaParams)

  return res.json({
    status: 'success',
    payload: { media },
  })
}
