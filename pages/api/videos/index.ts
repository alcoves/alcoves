import { Video } from '../../../types/types'
import { startProcessing } from '../../../lib/tidal'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<Video>) {
  if (req.method === 'POST') {
    const createVideoResult = await startProcessing(req.body.uploadId)
    return res.json(createVideoResult)
  }

  return res.status(404)
}
