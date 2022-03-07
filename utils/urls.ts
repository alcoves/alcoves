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

export function getShareUrl(id: string) {
  return `${window?.location?.href}v/${id}`
}
