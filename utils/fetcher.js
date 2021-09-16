import axios from 'axios'
import { getSession } from 'next-auth/react'

export async function fetcher(url, context) {
  const session = await getSession(context)
  const axiosOptions = { headers: { Authorization: 'Bearer ' + session.accessToken } }
  const { data } = await axios.get(url, axiosOptions)
  return data
}
