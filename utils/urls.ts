export function getAPIUrl(): string {
  return `${process.env.NEXT_PUBLIC_API_URL}`
}

export function getOriginalUrl(cdnUrl: string): string {
  return `${cdnUrl}/original`
}

export function getOptimizedUrl(cdnUrl: string): string {
  return `${cdnUrl}/optimized`
}

export function getHlsUrl(cdnUrl: string): string {
  return `${cdnUrl}/hls/main.m3u8`
}

export function getThumanailUrl(cdnUrl: string): string {
  return `${cdnUrl}/thumbnail.jpg`
}

export function getPublicUrl(id: string) {
  if (typeof window !== 'undefined') {
    return `${window?.location?.href}v/${id}`
  }
  return `https://bken.io/v/${id}`
}
