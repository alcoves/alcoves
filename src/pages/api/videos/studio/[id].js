import db from '../../../../utils/db';
import { getSession, } from 'next-auth/client';
import { s3 } from '../../../../utils/s3';

// Returns video for an authenticated user
// consumed by the studio page
export default async function handler(req, res) {
  try {
    const session = await getSession({ req });
    if (session) {
      if (req.method === 'GET') {
        const videos = await db.video.findFirst({ 
          where: { videoId: req.query.id, userId: session.id },
        });
        res.send(videos);
      }

      if (req.method === 'PATCH') {
        const videoCheck = await db.video.findUnique({ where: { videoId: req.query.id } })
        // Ensure that the user requesting the delete has access
        if (videoCheck.userId !== session.id) {
          return res.status(403).end()
        }
        const video = await db.video.update({
          data: { ...req.body },
          where: { videoId: req.query.id }
        })
        res.send(video);
      }

      if (req.method === 'DELETE') {
        const video = await db.video.findUnique({ where: { videoId: req.query.id } })

        // Ensure that the user requesting the delete has access
        if (video.userId !== session.id) {
          return res.status(403).end()
        }

        // Delete assets from cdn
        const { Contents } = await s3.listObjectsV2({
          Bucket: 'cdn.bken.io',
          Prefix: `v/${req.query.id}`
        }).promise()

        await Promise.all(Contents.map(({ Key }) => {
          s3.deleteObject({ Bucket: 'cdn.bken.io', Key }).promise()
        }))

        // Delete video from db
        await db.video.delete({ where: { videoId: req.query.id } })
        res.status(200).end()
      }
    } else {
      res.status(401).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}