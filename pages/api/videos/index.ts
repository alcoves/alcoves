import axios from '../../../config/axios'
import { Video } from '../../../types/types'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<Video>) {
  if (req.method === 'POST') {
    const result = await axios.post(`${process.env.TIDAL_API_ENDPOINT}/videos`, {
      uploadId: req.body.uploadId,
    })
    return res.json(result.data)
  }

  res.status(400)
}
