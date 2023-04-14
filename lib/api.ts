import axios from 'axios'

const apiUrl =
  process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://pier.rustyguts.net'

export async function getAssets(asPath?: string) {
  const url = `${apiUrl}${asPath}`
  const response = await axios.get(url)
  return response.data
}
