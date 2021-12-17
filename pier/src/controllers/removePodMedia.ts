import db from '../config/db'
import { defaultBucket, deleteFolder } from '../config/s3'

export async function removePodMedia(req, res) {
  const { podId } = req.params
  const { mediaItemIds = [] } = req.body
  const hasMembership = await db.membership.findFirst({
    where: { userId: req.user.id, podId },
  })
  if (!hasMembership) return res.sendStatus(403)

  const mediaItems = await db.mediaItem.findMany({
    where: {
      id: {
        in: mediaItemIds,
      },
    },
    include: {
      user: true,
    },
  })

  // Caller must own the media requested to un-share
  const mediaNotOwnedByAuthenticatedUser = mediaItems.filter(m => {
    return m.user.id !== req.user.id
  })
  if (mediaNotOwnedByAuthenticatedUser?.length) {
    return res.sendStatus(403)
  }

  await db.mediaReference.deleteMany({
    where: {
      podId,
      mediaId: {
        in: mediaItemIds,
      },
    },
  })

  return res.sendStatus(200)
}

export async function del(req, res) {
  const { podId, mediaReferenceIds } = req.body
  if (!podId || !mediaReferenceIds?.length) return res.sendStatus(400)

  const hasMembership = await db.membership.findFirst({
    where: { userId: req.user.id, podId },
  })
  if (!hasMembership) return res.sendStatus(403)

  const pod = await db.pod.findFirst({ where: { id: podId } })

  await Promise.all(
    mediaReferenceIds.map(async mediaRefId => {
      console.log(`Starting to delete media record ${mediaRefId}`)

      const mediaReference = await db.mediaReference.findFirst({
        where: { id: parseInt(mediaRefId) },
      })
      if (!mediaReference) return

      if (pod?.isDefault && hasMembership.userId === req.user.id) {
        console.log('Deleting shared references')
        await db.mediaReference.deleteMany({
          where: { mediaId: mediaReference.mediaId },
        })

        console.log('Deleting s3 folder')
        await deleteFolder({
          Bucket: defaultBucket,
          Prefix: `files/${podId}/${mediaReference.mediaId}`,
        })

        console.log('Deleting media entry')
        await db.mediaItem.delete({ where: { id: mediaReference.mediaId } })
      } else {
        console.log('Deleting shared reference')
        await db.mediaReference.delete({
          where: { id: mediaRefId },
        })
      }
    })
  )

  return res.sendStatus(200)
}
