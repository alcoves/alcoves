import { getSession, } from 'next-auth/client';
import { processThumbnail, } from '../../../../utils/tidal';

export default async function handler(req, res) {
  try {
    const session = await getSession({ req });
    if (!session) return res.status(403).end();
    if (req.method === 'POST') {
      await processThumbnail(req.query.id);
    }
    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}