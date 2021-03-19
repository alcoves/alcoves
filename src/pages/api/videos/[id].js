import db from '../../../utils/db';

async function getVideo(req, res) {
  const video = await db.video.findFirst({ where: { videoId: req.query.id } });
  if (!video) return res.status(404).end();
  return res.json(video)
}

async function patchVideo(req, res) {
  // const videoCheck = await db.video.findUnique({ where: { videoId: req.query.id } })
  // Ensure that the user requesting the delete has access
  // if (videoCheck.userId !== session.id) {
  //   return res.status(403).end()
  // }

  // Tidal webhook events send this data
  // TODO :: is there a cleaner way to sanitize inputs?
  delete req.body.id
  delete req.body.renditions
  await db.video.update({
    data: { ...req.body },
    where: { videoId: req.query.id }
  })
  res.status(200).end();
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      await getVideo(req, res)
    } else if (req.method === 'PATCH') {
      await patchVideo(req, res)
    }
    res.status(400).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}