// import db from '../config/db'

// export async function addPodMedia(req, res) {
//   const { podId } = req.params
//   const { mediaReferenceIds = [] } = req.body
//   if (!podId || !mediaReferenceIds?.length) return res.sendStatus(400)

//   const userLibrary = await db.library.findFirst({
//     where: { userId: req.user.id },
//   })
//   if (!hasMembership) return res.sendStatus(403)
//   if (hasMembership?.pod.isDefault) return res.sendStatus(400)

//   const mediaItems = await db.mediaReference.findMany({
//     where: {
//       id: {
//         in: mediaReferenceIds,
//       },
//     },
//     include: {
//       media: {
//         include: {
//           user: {
//             select: {
//               id: true,
//             },
//           },
//         },
//       },
//     },
//   })

//   // Caller must own the media requested to share
//   const mediaNotOwnedByAuthenticatedUser = mediaItems.filter(m => {
//     return m.media.user.id !== req.user.id
//   })
//   if (mediaNotOwnedByAuthenticatedUser?.length) {
//     return res.sendStatus(403)
//   }

//   await db.mediaReference.createMany({
//     data: mediaReferenceIds.map((mediaRefId, index) => {
//       return { podId, mediaId: mediaItems[index].media.id }
//     }),
//     skipDuplicates: true,
//   })

//   return res.sendStatus(200)
// }

// export async function createPod(req, res) {
//   const pod = await db.pod.create({
//     data: { name: req.body.name },
//   })
//   await db.membership.create({
//     data: { role: 'ADMIN', userId: req.user.id, podId: pod.id },
//   })
//   return res.json({
//     status: 'success',
//     payload: { pod },
//   })
// }

// export async function deletePod(req, res) {
//   const { podId } = req.params
//   const hasMembership = await db.membership.findFirst({
//     where: { userId: req.user.id, podId },
//   })
//   if (!hasMembership) return res.sendStatus(403)

//   const pod = await db.pod.findFirst({
//     where: { id: podId },
//     include: {
//       media: true,
//     },
//   })
//   if (pod?.media.length) return res.sendStatus(400)

//   await db.membership.deleteMany({
//     where: { podId },
//   })
//   await db.pod.delete({
//     where: { id: podId },
//   })

//   return res.sendStatus(200)
// }

// import { Prisma } from '@prisma/client'

// export async function listPodMedia(req, res) {
//   const { podId } = req.params
//   const { id: userId } = req.user

//   const hasMembership = await db.membership.findFirst({
//     where: { userId, podId },
//   })
//   if (!hasMembership) return res.sendStatus(403)

//   const mediaParams: Prisma.MediaReferenceFindManyArgs = {
//     // take: 50,
//     include: {
//       media: {
//         include: {
//           user: {
//             select: {
//               id: true,
//               image: true,
//               username: true,
//             },
//           },
//         },
//       },
//     },
//     orderBy: [{ id: 'desc' }],
//     where: { podId },
//   }

//   if (req.query.before) {
//     mediaParams.skip = 1
//     mediaParams.orderBy = [{ id: 'desc' }]
//     mediaParams.cursor = {
//       id: parseInt(req.query.before),
//     }
//   }

//   const media = await db.mediaReference.findMany(mediaParams)

//   return res.json({
//     status: 'success',
//     payload: { media },
//   })
// }

// export async function listPods(req, res) {
//   const memberships = await db.membership.findMany({
//     include: {
//       pod: true,
//     },
//     where: { userId: req.user.id },
//   })

//   return res.json({
//     status: 'success',
//     payload: {
//       pods: memberships.map(({ pod }) => {
//         return pod
//       }),
//     },
//   })
// }

// export async function patchPod(req, res) {
//   const pod = await db.pod.update({
//     where: { id: req.params.podId },
//     data: {
//       ...req.body, // TODO :: Please validate the body here
//     },
//   })

//   return res.json({
//     status: 'success',
//     payload: { pod },
//   })
// }

// import { defaultBucket, deleteFolder } from '../config/s3'

// export async function removePodMedia(req, res) {
//   const { podId } = req.params
//   const { mediaReferenceIds } = req.body
//   const hasMembership = await db.membership.findFirst({
//     where: { userId: req.user.id, podId },
//   })
//   if (!hasMembership) return res.sendStatus(403)
//   if (!mediaReferenceIds?.length) return res.sendStatus(400)

//   const pod = await db.pod.findFirst({ where: { id: podId } })

//   await Promise.all(
//     mediaReferenceIds.map(async mediaRefId => {
//       console.log(`Starting to delete media record ${mediaRefId}`)

//       const mediaReference = await db.mediaReference.findFirst({
//         where: { id: parseInt(mediaRefId) },
//       })
//       if (!mediaReference) return

//       if (pod?.isDefault && hasMembership.userId === req.user.id) {
//         console.log('Deleting shared references')
//         await db.mediaReference.deleteMany({
//           where: { mediaId: mediaReference.mediaId },
//         })

//         console.log('Deleting s3 folder')
//         await deleteFolder({
//           Bucket: defaultBucket,
//           Prefix: `files/${podId}/${mediaReference.mediaId}`,
//         })

//         console.log('Deleting media entry')
//         await db.mediaItem.delete({ where: { id: mediaReference.mediaId } })
//       } else {
//         console.log('Deleting shared reference')
//         await db.mediaReference.delete({
//           where: { id: mediaRefId },
//         })
//       }
//     })
//   )
//   return res.sendStatus(200)
// }

export {}
