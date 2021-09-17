import axios, { AxiosRequestConfig } from 'axios'
import { getSession, GetSessionParams } from 'next-auth/react'

export async function fetcher(url: string, context?: GetSessionParams) {
  const session = await getSession(context)
  const axiosOptions = { headers: { Authorization: `Bearer ${session?.accessToken}` } }
  const { data } = await axios.get(url, axiosOptions)
  return data
}

export async function fetchMutate(requestConfig: AxiosRequestConfig, context?: GetSessionParams) {
  const session = await getSession(context)
  const axiosOptions: AxiosRequestConfig = {
    ...requestConfig,
    headers: { Authorization: `Bearer ${session?.accessToken}` },
  }
  const { data } = await axios(axiosOptions)
  return data
}
