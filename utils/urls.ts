export function getOriginalUrl(id: string): string {
  return `${process.env.NEXT_PUBLIC_CDN_URL}/v/${id}/original`
}

export function getOptimizedUrl(id: string): string {
  return `${process.env.NEXT_PUBLIC_CDN_URL}/v/${id}/optimized`
}

export function getThumanailUrl(id: string, thumbnailFilename: string): string {
  return `${process.env.NEXT_PUBLIC_CDN_URL}/v/${id}/thumbnails/${thumbnailFilename}`
}
