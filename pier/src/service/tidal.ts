import axios from 'axios'
import { Video } from '@prisma/client'
import { archiveBucket, cdnBucket } from '../config/s3'

export function dispatchJob(route: string, data: any) {
  const dispatchURL = new URL(route, process.env.TIDAL_URL).toString()
  console.log('dispatchURL', dispatchURL)

  const apiKey = process.env.TIDAL_API_KEY
  if (!apiKey) throw new Error('Invalid TIDAL_API_KEY')
  return axios.post(dispatchURL, data, { headers: { 'x-api-key': apiKey } })
}

export function dispatchMetadataJob(video: Video) {
  return dispatchJob('/videos/metadata', {
    assetId: video.id,
    input: `s3://${archiveBucket}/${video.archivePath}`,
  })
}

export function dispatchThumbnailJob(video: Video) {
  return dispatchJob('/videos/metadata', {
    width: 854,
    height: 480,
    fit: 'cover',
    assetId: video.id,
    input: `s3://${archiveBucket}/${video.archivePath}`,
    output: `s3://${cdnBucket}/v/${video.id}/thumbnail.webp`,
  })
}

export function dispatchTranscodeJob(video: Video) {
  return dispatchJob('/videos/metadata', {
    assetId: video.id,
    output: `s3://${cdnBucket}/v/${video.id}`,
    input: `s3://${archiveBucket}/${video.archivePath}`,
  })
}

export async function tidalVideoCreate(video: Video) {
  try {
    await dispatchMetadataJob(video)
    await dispatchThumbnailJob(video)
    await dispatchTranscodeJob(video)
  } catch (error) {
    console.error(error)
    throw error
  }
}

export function parseDimensions(metadata): { width: number; height: number } {
  let width: number = metadata?.video[0]?.width || 0
  let height: number = metadata?.video[0]?.height || 0

  if (metadata?.video[0]?.tags?.rotate) {
    const rotateInt = parseInt(metadata?.video[0]?.tags?.rotate)
    switch (rotateInt) {
      case 90:
        width = metadata?.video[0]?.height
        height = metadata?.video[0]?.width
        break
      case -90:
        width = metadata?.video[0]?.height
        height = metadata?.video[0]?.width
    }
  }

  return { width, height }
}
