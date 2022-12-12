// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type UploadRequest = {
  url: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<UploadRequest>) {
  if (req.method === 'POST') {
    return res.json({
      url: '123',
    })
  } else {
    // Handle any other HTTP method
  }

  res.status(400)
}
