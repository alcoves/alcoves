import { Asset } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export function getAssetUrl(asset: Asset) {
  console.log(asset.contentType)

  if (asset.contentType.includes('video')) {
    return `${API_URL}/stream/${asset.id}.m3u8`
  } else {
    return `${API_URL}/stream/${asset.id}`
  }
}
