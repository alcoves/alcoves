import axios from 'axios';
import { getSession, } from 'next-auth/client';
import db from '../../../utils/db';
import { s3, } from '../../../utils/s3';
import isAdmin from '../../../utils/isAdmin';
import { getTidalURL, getWebhookURL, } from '../../../utils/tidal';

async function createVideo(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).end();
  const { duration, title, videoId, key, parts, uploadId } = JSON.parse(req.body);

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) res.status(401).end();
  
  await s3.completeMultipartUpload({
    Key: key,
    UploadId: uploadId,
    Bucket: 'cdn.bken.io',
    MultipartUpload: { Parts: parts },
  }).promise();

  await db.video.create({
    data: {
      title,
      duration,
      videoId,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Invoke tidal
  await axios.post(getTidalURL(), {
    rcloneSource: `wasabi:cdn.bken.io/${key}`,
    rcloneDest: `wasabi:cdn.bken.io/v/${videoId}`,
    webhookURL: getWebhookURL(videoId),
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  res.status(200).end();
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const session = await getSession({ req });
      const where = {};
      const orderBy = { createdAt: 'desc' };

      if (req?.query?.visibility === 'all' && isAdmin(session.id)) {
        console.log('in admin block');
        // Don't do anything, all videos are returned
        // This is consumed by the admin dashboard
      } else {
        // Default to showing public videos only
        where.visibility = 'public';
      }

      const videos = await db.video.findMany({
        where,
        orderBy,
      });
      return res.json(videos);
    }

    // User is completing a multipart upload
    if (req.method === 'POST') {
      return createVideo(req, res);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}