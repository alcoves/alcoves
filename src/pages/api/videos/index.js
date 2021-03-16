import { PrismaClient, } from '@prisma/client';
import createVideo from '../../../api/createVideo';

export default async function handler(req, res) {

  try {
    if (req.method === 'GET') {
      const prisma = new PrismaClient();
      const videos = await prisma.video.findMany({ where: { visibility: 'public' } });
      console.log('videos', videos);
      if (!videos.length) return res.status(404).end();
      return res.json(videos);
    }

    // User is completing a multipart upload
    if (req.method === 'POST') {
      return createVideo(req, res);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  } finally {
    await prisma.$disconnect();
  }
}