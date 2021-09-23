import axios from 'axios'

function getTidalUrl() {
  if (process.env.NODE_ENV !== 'production') {
    return `http://localhost:3200`
  }
  return `https://tidal.bken.io`
}

export async function createAsset(input: string) {
  const { data } = await axios.post(`${getTidalUrl()}/assets`, {
    input,
  })
  return data.data
}

export async function deleteAsset(assetId: string) {
  const { data } = await axios.delete(`${getTidalUrl()}/assets/${assetId}`)
  return data
}