import cuid from 'cuid'
import sharp from 'sharp'
import mime from 'mime-types'

interface DataURIScheme {
  data: string
  encoding: string
  contentType: string
}

export function getAvatarUploadKey(userId: string, contentType: string) {
  const imageId = cuid()
  const extention = mime.extension(contentType)
  return `avatars/${userId}/${imageId}.${extention}`
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
      .resize(500, 500, {
        fit: 'contain',
      })
      .jpeg({
        quality: 85,
        progressive: true,
      })
      .toBuffer()
    return image
  } catch (error) {
    console.error(error)
    throw new Error('Failed to optimize user avatar')
  }
}
