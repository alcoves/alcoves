import axios from 'axios'

export const apiUrl =
  process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://pier.rustyguts.net'

export async function getVideos() {
  const url = `${apiUrl}/videos`
  const response = await axios.get(url)
  return response.data
}

export async function getVideosByTagId(tagId: string) {
  const url = `${apiUrl}/videos?tag=${tagId}`
  const response = await axios.get(url)
  return response.data
}

export async function getVideo(id: string) {
  const url = `${apiUrl}/videos/${id}`
  const response = await axios.get(url)
  return response.data
}

export async function getTags() {
  const url = `${apiUrl}/tags`
  const response = await axios.get(url)
  return response.data
}

export async function getTag(id: string) {
  const url = `${apiUrl}/tags/${id}`
  const response = await axios.get(url)
  return response.data
}

export async function createTag(data: any) {
  const url = `${apiUrl}/tags`
  const response = await axios.post(url, data)
  return response.data
}

export async function updateTag(id: string, data: any) {
  const url = `${apiUrl}/tags/${id}`
  const response = await axios.patch(url, data)
  return response.data
}
