export function getAPIUrl(): string {
  return `${process.env.NEXT_PUBLIC_API_URL}`
}

export function getHlsUrl(cdnUrl: string): string {
  return `${cdnUrl}/master.m3u8`
}

export function getMpdUrl(cdnUrl: string): string {
  return `${cdnUrl}/master.mpd`
}

export function getPublicUrl(id: string) {
  if (typeof window !== 'undefined') {
    return `${window?.location?.href}v/${id}`
  }
  return `https://bken.io/v/${id}`
}
