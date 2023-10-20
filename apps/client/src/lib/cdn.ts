const CDN_URL = import.meta.env.VITE_CDN_URL

export function cdnURL(url: string) {
  return new URL(url, CDN_URL)
}
