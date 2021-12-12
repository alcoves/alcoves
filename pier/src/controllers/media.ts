import db from '../config/db'
import { Prisma } from '@prisma/client'

export async function create(req, res) {
  // const hasMembership = await db.membership.findFirst({
  //   where: { userId: req.user.id, podId: req.params.podId },
  // })
  // if (!hasMembership) return res.sendStatus(403)
  // const media = await db.media.create({
  //   data: {
  //     userId: req.user.id,
  //     content: req.body.content,
  //     channelId: req.params.channelId,
  //   },
  //   include: {
  //     user: true,
  //   },
  // })
  // return res.json({
  //   status: 'success',
  //   payload: { media },
  // })

  return res.sendStatus(200)
}

export async function list(req, res) {
  // const hasMembership = await db.membership.findFirst({
  //   where: { userId: req.user.id, harborId: req.params.harborId },
  // })
  // if (!hasMembership) return res.sendStatus(403)

  // const messageParams: Prisma.MessageFindManyArgs = {
  //   take: 50,
  //   include: { user: true },
  //   orderBy: [{ id: 'desc' }],
  //   where: { channelId: req.params.channelId },
  // }

  // if (req.query.before) {
  //   messageParams.skip = 1
  //   messageParams.orderBy = [{ id: 'desc' }]
  //   messageParams.cursor = {
  //     id: parseInt(req.query.before),
  //   }
  // }

  // const messages = await db.message.findMany(messageParams)

  // return res.json({
  //   status: 'success',
  //   payload: { messages },
  // })

  return res.sendStatus(200)
}
