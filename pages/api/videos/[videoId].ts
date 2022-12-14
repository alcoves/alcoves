import axios from '../../../config/axios'
import { Video } from '../../../types/types'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<Video>) {
  if (req.method === 'GET') {
    const url = `${process.env.TIDAL_API_ENDPOINT}/videos/${req.query.videoId}`
    const result = await axios.get(url)
    return res.json(result.data)
  }

  res.status(400)
}
