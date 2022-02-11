import db from '../config/db'

export async function listPods(req, res) {
  const memberships = await db.membership.findMany({
    where: { userId: req.user.id },
    include: { pod: true },
  })
  return res.json({
    payload: memberships.map(m => m.pod) || [],
  })
}

export async function createPod(req, res) {
  await db.pod.create({
    data: {
      name: new Date().toISOString(),
      memberships: {
        create: [
          {
            role: 'OWNER',
            userId: req.user.id,
          },
        ],
      },
    },
  })

  return res.sendStatus(200)
}

export async function getPod(req, res) {
  const membership = await db.membership.findFirst({
    where: { userId: req.user.id, podId: req.params.podId },
  })
  if (!membership) return res.sendStatus(400)

  const pod = await db.pod.findFirst({ where: { id: req.params.podId } })
  return res.json({ payload: pod })
}

export async function updatePod(req, res) {
  const membership = await db.membership.findFirst({
    where: { userId: req.user.id, podId: req.params.podId },
  })
  if (!membership) return res.sendStatus(400)

  return res.sendStatus(200)
}

export async function deletePod(req, res) {
  const membership = await db.membership.findFirst({
    where: { userId: req.user.id, podId: req.params.podId },
  })
  if (!membership) return res.sendStatus(400)

  await db.pod.delete({ where: { id: req.params.podId } })
  return res.sendStatus(200)
}
