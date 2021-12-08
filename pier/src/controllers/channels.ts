import db from '../config/db'

export async function getChannels(req, res) {
  const hasMembership = await db.membership.findFirst({
    where: { userId: req.user.id, harbourId: req.params.harbourId },
  })

  if (!hasMembership) return res.sendStatus(403)
  const channels = await db.channel.findMany({
    where: { harbourId: req.params.harbourId },
  })

  return res.json({
    status: 'success',
    payload: { channels },
  })
}

export async function createChannel(req, res) {
  const hasMembership = await db.membership.findFirst({
    where: { userId: req.user.id, harbourId: req.params.harbourId },
  })

  if (!hasMembership) return res.sendStatus(403)
  const channel = await db.channel.create({
    data: {
      name: req.body.name,
      harbourId: req.params.harbourId,
    },
  })

  return res.json({
    status: 'success',
    payload: { channel },
  })
}
