import db from '../config/db'

export async function listPods(req, res) {
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
