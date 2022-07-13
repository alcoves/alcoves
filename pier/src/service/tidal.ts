import axios from 'axios'

export function dispatchJob(route: string, data: any) {
  const dispatchURL = new URL(route, process.env.TIDAL_URL).toString()
  console.log('dispatchURL', dispatchURL)

  const apiKey = process.env.TIDAL_API_KEY
  if (!apiKey) throw new Error('Invalid TIDAL_API_KEY')
  return axios.post(dispatchURL, data, { headers: { 'x-api-key': apiKey } })
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
