import { getSession, } from 'next-auth/client';
import db from '../../../utils/db';
import { s3, } from '../../../utils/s3';
import { processThumbnail, processVideo, } from '../../../utils/tidal';

async function createVideo(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).end();
  const {
    duration, title, id, key, parts, uploadId, 
  } = JSON.parse(req.body);

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) res.status(401).end();
  
  console.info('Completing multipart s3 upload');
  await s3.completeMultipartUpload({
    Key: key,
    UploadId: uploadId,
    Bucket: 'cdn.bken.io',
    MultipartUpload: { Parts: parts },
  }).promise();

  console.info('Creating tidal video'); // Starts processing
  const video = tidal.createVideo(`https://cdn.bken.io/v/${id}/original`);

  console.info('Associate video with user');
  await db.query('update videos set user_id = $1 where id = $2', [user.id, video.id]);

  console.info('Generating thumbnail');
  processThumbnail();

  console.info('Creating video database record');
  await db.video.create({
    data: {
      id,
      title,
      duration,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  res.status(200).end();
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // TODO :: Use the list videos endpoint from tidal
      // const session = await getSession({ req });
      // const where = {};
      // const orderBy = { createdAt: 'desc' };

      // if (req?.query?.visibility === 'all' && session?.user?.isAdmin) {
      //   // console.log('in admin block');
      //   // Don't do anything, all videos are returned
      //   // This is consumed by the admin dashboard
      // } else {
      //   // Default to showing public videos only
      //   where.visibility = 'public';
      // }

      // const videos = await db.video.findMany({
      //   where,
      //   orderBy,
      //   include: { user: true },
      // });
      // return res.json(videos);
    } else if (req.method === 'POST') {
      return createVideo(req, res);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}