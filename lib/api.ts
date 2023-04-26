import axios from 'axios'

export const apiUrl =
  process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://pier.rustyguts.net'

export async function getVideos() {
  const url = `${apiUrl}/videos`
  const response = await axios.get(url)
  return response.data
}

export async function getVideo(id: string) {
  const url = `${apiUrl}/videos/${id}`
  const response = await axios.get(url)
  return response.data
}
