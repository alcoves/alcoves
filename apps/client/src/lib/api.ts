import { LOCALSTORAGE_TOKEN_KEY } from './util'
import axios, { AxiosRequestConfig } from 'axios'

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
