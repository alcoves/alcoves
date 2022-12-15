import { createUpload } from '../../lib/tidal'
import { UploadResponse } from '../../types/types'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<UploadResponse>) {
  if (req.method === 'POST') {
    const uploadResponse = await createUpload()
    return res.json(uploadResponse)
  }

  return res.status(404)
}
