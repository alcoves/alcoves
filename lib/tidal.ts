export default function tidal() {
  return true
}

// import { UploadResponse, Video } from '../types/types'

// async function executeRequest(url, options?: any) {
//   const res = await fetch(url, {
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//       'x-api-key': process.env.TIDAL_API_KEY || '',
//     },
//     ...options,
//   })

//   if (!res.ok) {
//     console.error(url, JSON.stringify(options))
//     throw new Error('Failed to fetch data')
//   }

//   return res.json()
// }

// export function createUpload(): Promise<UploadResponse> {
//   const url = `${process.env.TIDAL_API_ENDPOINT}/uploads`
//   return executeRequest(url, { method: 'POST' })
// }

// export function startProcessing(uploadId: string): Promise<Video> {
//   const url = `${process.env.TIDAL_API_ENDPOINT}/videos`
//   return executeRequest(url, {
//     method: 'POST',
//     body: JSON.stringify({ uploadId }),
//   })
// }

// export function getVideo(videoId: string): Promise<Video> {
//   const url = `${process.env.TIDAL_API_ENDPOINT}/videos/${videoId}`
//   return executeRequest(url)
// }
