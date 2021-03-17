import axios from 'axios';
import { getSession, } from 'next-auth/client';
import { s3, } from '../utils/s3';
import db from '../utils/db';

export default async function createVideo(req, res) {
  const session = await getSession({ req });
  console.log(session);
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
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  // Invoke tidal
  await axios.post('https://bk-det1.bken.dev/tidal/videos', {
    rcloneSource: `wasabi:cdn.bken.io/${key}`,
    rcloneDest: `wasabi:cdn.bken.io/tmp/${videoId}`,
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  res.status(200).end();
}