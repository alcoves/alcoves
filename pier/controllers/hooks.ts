import { Request, Response } from 'express'
import { Video } from '../lib/models'

export async function patch(req: Request, res: Response) {
  const body = req.body
  console.log("Request Body", body)
  const video = await Video.findOneAndUpdate({
    _id: req.params.videoId
  }, { status: `updated ${Date.now()}` })
  console.log("video", video)
  return res.sendStatus(200)
}