import { Video } from '../types'
import axios, { AxiosRequestConfig } from 'axios'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function makeRequest(options: AxiosRequestConfig) {
  return axios(options)
}

export async function fetcher(url: string): Promise<any> {
  const res = await axios.get(url, { baseURL: API_URL })
  return res.data
}

export async function createVideo(
  url: string,
  { arg }: { arg: File }
): Promise<Video> {
  const formData = new FormData()
  formData.append('file', arg)
  const response = await makeRequest({
    url,
    data: formData,
    method: 'POST',
    baseURL: API_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function deleteVideo(
  url: string,
  { arg }: { arg: { id: string } }
) {
  const res = makeRequest({
    url,
    data: arg,
    method: 'DELETE',
    baseURL: API_URL,
  })
  return res
}
