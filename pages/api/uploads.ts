import axios from 'axios'
import { UploadResponse } from '../../types/types'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<UploadResponse>) {
  if (req.method === 'POST') {
    const result = await axios.post(`${process.env.TIDAL_API_ENDPOINT}/uploads`)
    return res.json(result.data)
  }

  res.status(400)
}
