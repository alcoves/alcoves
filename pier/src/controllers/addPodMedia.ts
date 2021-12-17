import db from '../config/db'

export async function addPodMedia(req, res) {
  const { podId } = req.params
  const { mediaItemIds = [] } = req.body
  if (!podId || !mediaItemIds?.length) return res.sendStatus(400)

  const hasMembership = await db.membership.findFirst({
    where: { userId: req.user.id, podId },
  })
  if (!hasMembership) return res.sendStatus(403)

  const mediaItems = await db.mediaReference.findMany({
    where: {
      id: {
        in: mediaItemIds,
      },
    },
    include: {
      media: {
        include: {
          user: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  })

  // Caller must own the media requested to share
  const mediaNotOwnedByAuthenticatedUser = mediaItems.filter(m => {
    return m.media.user.id !== req.user.id
  })
  if (mediaNotOwnedByAuthenticatedUser?.length) {
    return res.sendStatus(403)
  }

  await db.mediaReference.createMany({
    data: mediaItemIds.map(mediaId => {
      return { podId, mediaId }
    }),
    skipDuplicates: true,
  })

  return res.sendStatus(200)
}
