import { PrismaClient, } from '@prisma/client';

export default async function handler(req, res) {
  const prisma = new PrismaClient();

  try {
    if (req.method === 'GET') {
      const video = await prisma.video.findFirst({ where: { videoId: req.query.id } });
      if (!video) return res.status(404).end();
      return res.json(video);
    }
    res.status(400).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  } finally {
    await prisma.$disconnect();
  }
}