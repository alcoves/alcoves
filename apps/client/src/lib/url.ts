import { Asset } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export function getAssetUrl(asset: Asset) {
  return `${API_URL}/stream/${asset.id}`
  // return `${API_URL}/stream/${asset.id}.m3u8`

  // if (asset.contentType.includes('video')) {
  //   return `${API_URL}/stream/${asset.id}.m3u8`
  // } else {
  //   return `${API_URL}/stream/${asset.id}`
  // }
}
