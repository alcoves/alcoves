import axios from 'axios';
import { getSession, } from 'next-auth/client';
import db from '../../../../utils/db';
import { s3, } from '../../../../utils/s3';

async function getVideo(req, res) {
  const video = await db.video.findFirst({ where: { videoId: req.query.id } });
  if (!video) return res.status(404).end();
  return res.json(video);
}

async function deleteVideo(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).end();

  const video = await db.video.findUnique({ where: { videoId: req.query.id } });
  if (video.userId !== session.id) return res.status(403).end();

  // Ensure that the user requesting the delete has access
  if (video.userId !== session.id) {
    return res.status(403).end();
  }

  // Delete assets from cdn
  // This doesn't work on videos that have more than 1,000 objects
  const { Contents } = await s3.listObjectsV2({
    Bucket: 'cdn.bken.io',
    Prefix: `v/${req.query.id}`,
  }).promise();

  await Promise.all(Contents.map(({ Key }) => {
    s3.deleteObject({ Bucket: 'cdn.bken.io', Key }).promise();
  }));

  // Delete video from db
  await db.video.delete({ where: { videoId: req.query.id } });
  res.status(200).end();
}

// This endpoint is where user's edit their videos
// Tidal also uses this endpoint to webhook data in
async function patchVideo(req, res) {
  // const videoCheck = await db.video.findUnique({ where: { videoId: req.query.id } })
  // Ensure that the user requesting the delete has access
  // if (videoCheck.userId !== session.id) {
  //   return res.status(403).end()
  // }

  const reqKeys = Object.keys(req.body);
  const permittedKeys = ['status', 'percentCompleted', 'title', 'visibility', 'thumbnail' , 'mpdLink'];
  const update = permittedKeys.reduce((acc, cv) => {
    if (reqKeys.includes(cv)) {
      // This is where tidal webhooks land
      // wasabi:cdn.bken.io/path are transformmed into https://cdn.bken.io/path
      if (cv === 'mpdLink' || cv === 'thumbnail') {
        if (req.body[cv]) {
          acc[cv] = `https://${req.body[cv].split(':')[1]}`; // wasabi:cdn.bken.io/path
        }
      } else {
        acc[cv] = req.body[cv];
      }
    }
    return acc;
  }, {});

  await db.video.update({
    data: update,
    where: { videoId: req.query.id },
  });
  res.status(200).end();
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      await getVideo(req, res);
    } else if (req.method === 'PATCH') {
      await patchVideo(req, res);
    } else if (req.method === 'DELETE') {
      await deleteVideo(req, res);
    }
    res.status(400).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}