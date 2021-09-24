import axios, { AxiosRequestConfig } from 'axios'
import { Types } from 'mongoose'

const tidalOptions: AxiosRequestConfig = {
  headers: {
    'X-API-Key': process.env.TIDAL_API_KEY
  }
}

function getTidalUrl() {
  if (process.env.TIDAL_API_URL) return process.env.TIDAL_API_URL
  throw new Error('TIDAL_API_URL is undefined')
}

export async function getAsset(id: Types.ObjectId) {
  const { data } = await axios.get(`${getTidalUrl()}/assets/${id}`, tidalOptions)
  return data.data
}

export async function createAsset(input: string) {
  const { data } = await axios.post(`${getTidalUrl()}/assets`, {
    input,
  }, tidalOptions)
  return data.data
}

export async function deleteAsset(assetId: string) {
  const deleteUrl = `${getTidalUrl()}/assets/${assetId.toString()}`
  await axios.delete(deleteUrl, tidalOptions).catch((e) => console.error(e))
}

