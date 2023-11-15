import axios, { AxiosRequestConfig } from 'axios'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function fetcher(url: string): Promise<any> {
  const res = await axios.get(url, { baseURL: API_URL })
  return res.data
}

export function createRequest(method: AxiosRequestConfig['method']) {
  return async (url: string, { arg: data }: { arg: any }) => {
    const token = localStorage.getItem('token')

    const config: AxiosRequestConfig = {
      data,
      method,
      url: new URL(url, API_URL).toString(),
    }

    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
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
