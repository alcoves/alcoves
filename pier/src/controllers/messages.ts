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
  req.app.get('io').to('shack').emit('message', message)

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

  // setInterval(() => {
  //   console.log('loop')
  //   io.to('shack').emit('heartbeat')
  // }, 500)

  const messageQuery = {
    take: 50,
    include: { user: true },
    where: { channelId: req.params.channelId },
    // orderBy: [
    //   {
    //     createdAt: 'desc',
    //   },
    // ],
  }

  // if (cursor) {
  //   where.createdAt = {
  //     lt: new Date(before),
  //   }
  // }

  return res.json({
    status: 'success',
    payload: {
      messages: await db.message.findMany(messageQuery),
    },
  })
}
