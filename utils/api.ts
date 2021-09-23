export function getApiUrl(): string {
  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:3100'
  }
  return 'https://api.bken.io'
}

export function getTidalUrl(): string {
  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:3200'
  }
  return 'https://tidal.bken.io'
}
