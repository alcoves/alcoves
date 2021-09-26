export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_BKEN_API_URL || 'https://api.bken.io'
}

export function getTidalUrl(): string {
  return process.env.NEXT_PUBLIC_TIDAL_API_URL || 'https://tidal.bken.io'
}
