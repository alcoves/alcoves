import db from '../config/db'

export async function getChannels(req, res) {
  const hasMembership = await db.membership.findFirst({
    where: { userId: req.user.id, harborId: req.params.harborId },
  })

  if (!hasMembership) return res.sendStatus(403)
  const channels = await db.channel.findMany({
    where: { harborId: req.params.harborId },
  })

  return res.json({
    status: 'success',
    payload: { channels },
  })
}

export async function createChannel(req, res) {
  const hasMembership = await db.membership.findFirst({
    where: { userId: req.user.id, harborId: req.params.harborId },
  })

  if (!hasMembership) return res.sendStatus(403)
  const channel = await db.channel.create({
    data: {
      name: req.body.name,
      harborId: req.params.harborId,
    },
  })

  return res.json({
    status: 'success',
    payload: { channel },
  })
}
