import { s3 } from '../../config/s3'
import type { NextApiRequest, NextApiResponse } from 'next'

type UploadRequest = {
  url: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<UploadRequest>) {
  console.log('request')
  if (req.method === 'POST') {
    const url = await s3.getSignedUrlPromise('getObject', {
      Key: 'test.mp4',
      Bucket: process.env.DEFAULT_BUCKET,
    })

    return res.json({
      url: 'https://s3.rustyguts.net/tidal/test/main.m3u8',
    })
  } else if (req.method === 'GET') {
  } else {
    // Handle any other HTTP method
  }

  res.status(400)
}
