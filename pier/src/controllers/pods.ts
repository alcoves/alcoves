import db from '../config/db'

export async function create(req, res) {
  const pod = await db.pod.create({
    data: { name: req.body.name },
  })
  await db.membership.create({
    data: { role: 'owner', userId: req.user.id, podId: pod.id },
  })
  return res.json({
    status: 'success',
    payload: { pod },
  })
}

export async function list(req, res) {
  const memberships = await db.membership.findMany({
    include: { pod: true },
    where: { userId: req.user.id },
  })

  return res.json({
    status: 'success',
    payload: {
      pods: memberships.map(({ pod }) => {
        return pod
      }),
    },
  })
}

export async function getById(req, res) {
  const membership = await db.membership.findFirst({
    where: { userId: req.user.id, podId: req.params.podId },
    include: { pod: true },
  })

  return res.json({
    status: 'success',
    payload: { pod: membership?.pod },
  })
}

export async function del(req, res) {
  const { podId } = req.params
  const hasMembership = await db.membership.findFirst({
    where: { userId: req.user.id, podId },
  })
  if (!hasMembership) return res.sendStatus(403)

  const hasMedia = await db.media.findFirst({
    where: { podId },
  })
  if (hasMedia) return res.sendStatus(400)

  await db.membership.deleteMany({
    where: { podId },
  })
  await db.pod.delete({
    where: { id: podId },
  })

  return res.sendStatus(200)
}

export async function patchById(req, res) {
  const pod = await db.pod.update({
    where: { id: req.params.podId },
    data: {
      ...req.body, // TODO :: Please validate the body here
    },
  })

  return res.json({
    status: 'success',
    payload: { pod },
  })
}
