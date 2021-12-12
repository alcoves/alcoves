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
    where: { userId: req.user.id, podId: req.params.pod },
    include: { pod: true },
  })

  return res.json({
    status: 'success',
    payload: { pod: membership?.pod },
  })
}
