import db from '../config/db'
import { defaultBucket, deleteFolder } from '../config/s3'

export async function removePodMedia(req, res) {
  const { podId } = req.params
  const { mediaReferenceIds } = req.body
  const hasMembership = await db.membership.findFirst({
    where: { userId: req.user.id, podId },
  })
  if (!hasMembership) return res.sendStatus(403)
  if (!mediaReferenceIds?.length) return res.sendStatus(400)

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
