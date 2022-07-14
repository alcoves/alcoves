import axios from 'axios'
import db from '../config/db'
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
  return dispatchJob('/videos/thumbnails', {
    width: 854,
    height: 480,
    fit: 'cover',
    assetId: video.id,
    input: `s3://${archiveBucket}/${video.archivePath}`,
    output: `s3://${cdnBucket}/v/${video.id}/thumbnail.webp`,
  })
}

export async function dispatchTranscodeJob(video: Video) {
  await db.video.update({
    where: { id: video.id },
    data: { progress: 0, status: 'PROCESSING' },
  })
  return dispatchJob('/videos/transcodes/adaptive', {
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
  const [vStream] = metadata.streams.filter(({ codec_type }) => {
    return codec_type === 'video'
  })

  let width: number = vStream.width || 0
  let height: number = vStream.height || 0

  const rotationFromVideoStream = metadata?.streams?.reduce((acc, cv) => {
    if (cv.codec_type === 'video') {
      if (cv?.side_data_list?.length) {
        cv?.side_data_list.map(v => {
          if (v.rotation) {
            acc = v.rotation.toString()
          }
        })
      } else if (cv?.tags?.rotate) {
        acc = cv?.tags?.rotate
      }
    }
    return acc
  }, '')

  const rotationFromDataStream = metadata?.streams?.reduce((acc, cv) => {
    if (cv.codec_type === 'data') {
      if (cv?.tags?.rotate) {
        acc = cv?.tags?.rotate
      }
    }
    return acc
  }, '')

  if (rotationFromVideoStream || rotationFromDataStream) {
    switch (parseInt(rotationFromVideoStream || rotationFromDataStream)) {
      case 90:
        width = vStream.height
        height = vStream.width
        break
      case -90:
        width = vStream.height
        height = vStream.width
    }
  }

  return { width, height }
}
