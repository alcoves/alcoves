import sharp from 'sharp'
import mime from 'mime-types'
import s3 from '../config/s3'
import { ManagedUpload } from 'aws-sdk/clients/s3'

interface DataURIScheme {
  data: string
  encoding: string
  contentType: string
}

// Parses https://en.wikipedia.org/wiki/Data_URI_scheme
export function parseDataURIScheme(dataURIScheme: string): DataURIScheme | null {
  const withoutData = dataURIScheme.split('data:')[1] || ''
  const [contentType, encoding, data] = withoutData.split(/;|,/)

  if (!data) return null
  if (encoding !== 'base64') return null

  return {
    contentType,
    encoding,
    data,
  }
}

export async function optimizeUserAvatar(dataUri: DataURIScheme) {
  try {
    const imageBuffer = Buffer.from(dataUri.data, 'base64')
    const image = await sharp(imageBuffer)
      .resize(250, 250, {
        fit: 'contain',
      })
      .jpeg({
        quality: 80,
        progressive: true,
      })
      .toBuffer()
    return image
  } catch (error) {
    console.error(error)
    throw new Error('Failed to optimize user avatar')
  }
}
