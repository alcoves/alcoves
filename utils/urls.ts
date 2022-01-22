export function getOriginalUrl(id: string): string {
  return `${process.env.NEXT_PUBLIC_CDN_URL}/v/${id}/original`
}

export function getOptimizedUrl(id: string): string {
  return `${process.env.NEXT_PUBLIC_CDN_URL}/v/${id}/optimized`
}

export function getHlsUrl(id: string): string {
  return `${process.env.NEXT_PUBLIC_CDN_URL}/v/${id}/hls/main.m3u8`
}

export function getThumanailUrl(id: string, thumbnailFilename: string): string {
  return `${process.env.NEXT_PUBLIC_CDN_URL}/v/${id}/thumbnails/${thumbnailFilename}`
}
