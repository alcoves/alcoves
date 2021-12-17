import db from '../config/db'

export async function deletePod(req, res) {
  const { podId } = req.params
  const hasMembership = await db.membership.findFirst({
    where: { userId: req.user.id, podId },
  })
  if (!hasMembership) return res.sendStatus(403)

  const pod = await db.pod.findFirst({
    where: { id: podId },
    include: {
      media: true,
    },
  })
  if (pod?.media.length) return res.sendStatus(400)

  await db.membership.deleteMany({
    where: { podId },
  })
  await db.pod.delete({
    where: { id: podId },
  })

  return res.sendStatus(200)
}
