import { LOCALSTORAGE_TOKEN_KEY } from './util'
import axios, { AxiosRequestConfig } from 'axios'

export const CDN_URL = import.meta.env.VITE_CDN_URL

export function getThumbnailUrlBase(assetId: string, useCdn: boolean = true) {
  if (!useCdn || !CDN_URL) return `/stream/${assetId}/thumbnail`
  return `${CDN_URL}/stream/${assetId}/thumbnail`
}

export function getDirectAssetUrlBase(assetId: string, useCdn: boolean = true) {
  if (!useCdn || !CDN_URL) return `/stream/${assetId}`
  return `${CDN_URL}/stream/${assetId}`
}

export async function fetcher(url: string): Promise<any> {
  const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)

  const config: AxiosRequestConfig = {
    url,
    method: 'GET',
  }

  if (token) {
    config.headers = {
      Authorization: `${token}`,
    }
  }

  const response = await axios(config)
  return response.data
}

export function createRequest(method: AxiosRequestConfig['method']) {
  return async (url: string, { arg: data }: { arg: any }) => {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)

    const config: AxiosRequestConfig = {
      url,
      data,
      method,
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
