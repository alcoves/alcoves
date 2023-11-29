import { Asset } from '../types'
import { LOCALSTORAGE_TOKEN_KEY } from './util'
import axios, { AxiosRequestConfig } from 'axios'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function fetcher(url: string): Promise<any> {
  const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)

  const config: AxiosRequestConfig = {
    url,
    method: 'GET',
    baseURL: API_URL,
  }

  if (token) {
    config.headers = {
      Authorization: `${token}`,
    }
  }

  console.log(config)
  const response = await axios(config)
  return response.data
}

export function createRequest(method: AxiosRequestConfig['method']) {
  return async (url: string, { arg: data }: { arg: any }) => {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)

    const config: AxiosRequestConfig = {
      data,
      method,
      url: new URL(url, API_URL).toString(),
    }

    if (token) {
      config.headers = {
        Authorization: `${token}`,
      }
    }

    try {
      const response = await axios(config)
      return response.data
    } catch (error) {
      console.error('Request failed:', error)
      throw error
    }
  }
}

export function getAssetUrl(asset: Asset) {
  return `${API_URL}/stream/${asset.id}`
  // return `${API_URL}/stream/${asset.id}.m3u8`

  // if (asset.contentType.includes('video')) {
  //   return `${API_URL}/stream/${asset.id}.m3u8`
  // } else {
  //   return `${API_URL}/stream/${asset.id}`
  // }
}
