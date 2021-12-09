import db from '../config/db'

export function createHarbor(req, res) {
  return res.json({
    status: 'success',
  })
}

export async function getHarbors(req, res) {
  const memberships = await db.membership.findMany({
    where: { userId: req.user.id },
    include: { harbor: true },
  })

  return res.json({
    status: 'success',
    payload: {
      harbors: memberships.map(({ harbor }) => {
        return harbor
      }),
    },
  })
}

export async function getHarborById(req, res) {
  const membership = await db.membership.findFirst({
    where: { userId: req.user.id, harborId: req.params.harborId },
    include: { harbor: true },
  })

  return res.json({
    status: 'success',
    payload: { harbor: membership?.harbor },
  })
}
