import { Prisma } from '@prisma/client'
import db from '../config/db'

export async function createMessage(req, res) {
  const hasMembership = await db.membership.findFirst({
    where: { userId: req.user.id, harborId: req.params.harborId },
  })
  if (!hasMembership) return res.sendStatus(403)

  const message = await db.message.create({
    data: {
      userId: req.user.id,
      content: req.body.content,
      channelId: req.params.channelId,
    },
    include: {
      user: true,
    },
  })

  // Dispatches new messages to connected clients
  req.app.get('io').to(req.params.harborId).emit('message', message)

  return res.json({
    status: 'success',
    payload: { message },
  })
}

export async function getMessages(req, res) {
  const hasMembership = await db.membership.findFirst({
    where: { userId: req.user.id, harborId: req.params.harborId },
  })
  if (!hasMembership) return res.sendStatus(403)

  const messageParams: Prisma.MessageFindManyArgs = {
    take: 50,
    include: { user: true },
    orderBy: [{ id: 'desc' }],
    where: { channelId: req.params.channelId },
  }

  if (req.query.before) {
    messageParams.skip = 1
    messageParams.orderBy = [{ id: 'desc' }]
    messageParams.cursor = {
      id: parseInt(req.query.before),
    }
  }

  const messages = await db.message.findMany(messageParams)

  return res.json({
    status: 'success',
    payload: { messages },
  })
}
