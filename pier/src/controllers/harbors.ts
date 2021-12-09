import db from '../config/db'

export async function createHarbor(req, res) {
  const harbor = await db.harbor.create({
    data: { name: req.body.name },
  })
  await db.membership.create({
    data: { role: 'owner', userId: req.user.id, harborId: harbor.id },
  })
  return res.json({
    status: 'success',
    payload: { harbor },
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
