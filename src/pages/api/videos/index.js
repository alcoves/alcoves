import db from '../../../utils/db';
import { s3 } from '../../../utils/s3';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { rows } = await db.query(`select * from videos where visibility = 'public' order by created_at asc`)
      res.send(rows)
    }

    // User is completing a multipart upload
    if (req.method === 'POST') {
      const { key, parts, uploadId } = JSON.parse(req.body)
      await s3.completeMultipartUpload({
        Key: key,
        UploadId: uploadId,
        Bucket: 'cdn.bken.io',
        MultipartUpload: { Parts: parts },
      }).promise();
      res.status(200).end()
      // const video = await prisma.video.create()
      // res.send(video)
    }

    res.status(400).end()
  } catch (error) {
    console.error(error);
    return res.status(500).end()
  }
}