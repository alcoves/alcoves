import { Video } from '../../../types/types'
import { getVideo } from '../../../lib/tidal'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<Video>) {
  if (req.method === 'GET') {
    const getVideoResponse = await getVideo(req.query.id as string)
    return res.json(getVideoResponse)
  }

  return res.status(404)
}
