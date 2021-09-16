import { getSession } from 'next-auth/react'
import db from '../../../../utils/db'
import { deleteFolder } from '../../../../utils/s3'
import { createVideo } from '../../../../utils/tidal'

async function getVideo(req, res) {
  const video = await db.video.findFirst({ where: { id: req.query.id } })
  if (!video) return res.status(404).end()
  return res.json(video)
}

async function deleteVideo(req, res) {
  const session = await getSession({ req })
  if (!session) return res.status(401).end()

  // Ensure the authenticated user is the owner of the video
  const video = await db.video.findUnique({ where: { id: req.query.id } })
  if (video.userId !== session.id) return res.status(403).end()

  // Delete assets from cdn
  await deleteFolder({
    Bucket: 'cdn.bken.io',
    Prefix: `v/${req.query.id}`,
  })

  // Delete video from db
  await db.video.delete({ where: { id: req.query.id } })
  res.status(200).end()
}

async function patchVideo(req, res) {
  const reqKeys = Object.keys(req.body)
  const permittedKeys = [
    'status',
    'title',
    'mpdLink',
    'thumbnail',
    'visibility',
    'percentCompleted',
  ]
  const update = permittedKeys.reduce((acc, cv) => {
    if (reqKeys.includes(cv)) {
      acc[cv] = req.body[cv]
    }
    return acc
  }, {})

  await db.video.update({
    data: update,
    where: { id: req.query.id },
  })
  res.status(200).end()
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      return getVideo(req, res)
    } else if (req.method === 'PATCH') {
      return patchVideo(req, res)
    } else if (req.method === 'DELETE') {
      return deleteVideo(req, res)
    } else if (req.method === 'POST') {
      await createVideo(req.query.id)
      res.status(200).end()
    }
    res.status(400).end()
  } catch (error) {
    console.error(error)
    res.status(500).end()
  }
}
