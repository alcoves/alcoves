import db from '../config/db'

export async function addPodMedia(req, res) {
  const { podId } = req.params
  const { mediaReferenceIds = [] } = req.body
  if (!podId || !mediaReferenceIds?.length) return res.sendStatus(400)

  const hasMembership = await db.membership.findFirst({
    where: { userId: req.user.id, podId },
    include: { pod: true },
  })
  if (!hasMembership) return res.sendStatus(403)
  if (hasMembership?.pod.isDefault) return res.sendStatus(400)

  const mediaItems = await db.mediaReference.findMany({
    where: {
      id: {
        in: mediaReferenceIds,
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
    data: mediaReferenceIds.map((mediaRefId, index) => {
      return { podId, mediaId: mediaItems[index].media.id }
    }),
    skipDuplicates: true,
  })

  return res.sendStatus(200)
}
