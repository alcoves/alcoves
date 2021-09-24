export function getApiUrl(): string {
  if (process.env.NEXT_PUBLIC_BKEN_API_URL) {
    return process.env.NEXT_PUBLIC_BKEN_API_URL
  }
  throw new Error('NEXT_PUBLIC_BKEN_API_URL is undefined')
}

export function getTidalUrl(): string {
  if (process.env.NEXT_PUBLIC_TIDAL_API_URL) {
    return process.env.NEXT_PUBLIC_TIDAL_API_URL
  }
  throw new Error('NEXT_PUBLIC_TIDAL_API_URL is undefined')
}
