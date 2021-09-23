import mongoose from 'mongoose'
import { Video } from '../lib/models'
import { Request, Response } from 'express'
import { generateManifest } from '../lib/generateManifest'

export async function getManifest(req: Request, res: Response) {
  const [videoId, extention] = req.params.videoId.split('.')
  if (extention === 'm3u8') {
    const video = await Video.findOne({
      _id:  new mongoose.Types.ObjectId(videoId),
    })
    if (!video) res.sendStatus(404)
    console.log('returning manifest')
    res.setHeader('content-type', 'application/x-mpegURL');
    return res.send(generateManifest().toString())
  }
  return res.sendStatus(400)
}