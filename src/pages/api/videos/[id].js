import axios from 'axios';
import { getSession, } from 'next-auth/client';
import db from '../../../utils/db';
import { s3, } from '../../../utils/s3';
import { getTidalURL, getWebhookURL, } from '../../../utils/tidal';

async function reprocessVideo(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).end();
  const video = await db.video.findFirst({ where: { videoId: req.query.id } });
  if (!video) return res.status(404).end();
  if (video.userId !== session.id) return res.status(403).end();
  // if (video.status !== 'completed') return res.status(400).end();

  // Invoke tidal
  await axios.post(getTidalURL(), {
    rcloneSource: `wasabi:cdn.bken.io/v/${video.videoId}/${video.videoId}.mp4`, // FIXME :: We should store the source file path
    rcloneDest: `wasabi:cdn.bken.io/v/${video.videoId}`,
    webhookURL: getWebhookURL(video.videoId),
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  res.status(200).end();
}

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
  const permittedKeys = ['status', 'percentCompleted', 'title', 'visibility', 'thumbnail' , 'hlsMasterLink'];
  const update = permittedKeys.reduce((acc, cv) => {
    if (reqKeys.includes(cv)) {
      // Override the paths coming from tidal
      if (cv === 'thumbnail' || cv === 'hlsMasterLink') {
        acc[cv] = `https://${req.body[cv].split(':')[1]}`; // wasabi:cdn.bken.io/path
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
    } else if (req.method === 'POST') {
      await reprocessVideo(req, res);
    }
    res.status(400).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}