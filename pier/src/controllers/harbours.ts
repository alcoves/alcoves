import db from '../config/db'

export function createHarbour(req, res) {
  return res.sendStatus(200)
}

export async function getHarbours(req, res) {
  const memberships = await db.membership.findMany({
    where: { userId: req.user.id },
    include: { harbour: true },
  })

  return res.json({
    harbours: memberships.map(({ harbour }) => {
      return harbour
    }),
  })
}

export async function getHarbourById(req, res) {
  const membership = await db.membership.findFirst({
    where: { userId: req.user.id, harbourId: req.params.harbourId },
    include: { harbour: true },
  })

  return res.json({
    harbour: membership?.harbour,
  })
}
