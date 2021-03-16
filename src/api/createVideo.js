import axios from 'axios';
import { getSession, } from 'next-auth/client';
import { s3, } from '../utils/s3';

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

export default async function createVideo(req, res) {
  const session = await getSession({ req });
  console.log(session);
  if (!session) return res.status(401).end();
  const { duration, title, video_id, key, parts, uploadId } = JSON.parse(req.body);

  const user = await prisma.users.findUnique({ where: { email: session.user.email } });
  if (!user) res.status(401).end();
  
  await s3.completeMultipartUpload({
    Key: key,
    UploadId: uploadId,
    Bucket: 'cdn.bken.io',
    MultipartUpload: { Parts: parts },
  }).promise();

  await prisma.videos.create({
    data: {
      title,
      duration,
      video_id,
      user_id: user.id,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  // Invoke tidal
  await axios.post('https://bk-det1.bken.dev/tidal/videos', {
    rcloneSource: `wasabi:cdn.bken.io/${key}`,
    rcloneDest: `wasabi:cdn.bken.io/tmp/${video_id}`,
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  res.status(200).end();
  await prisma.$disconnect();
}