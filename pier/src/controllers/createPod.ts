import db from '../config/db'

export async function createPod(req, res) {
  const pod = await db.pod.create({
    data: { name: req.body.name },
  })
  await db.membership.create({
    data: { role: 'ADMIN', userId: req.user.id, podId: pod.id },
  })
  return res.json({
    status: 'success',
    payload: { pod },
  })
}
