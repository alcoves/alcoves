import axios, { AxiosRequestConfig } from 'axios'
import { GetServerSidePropsContext } from 'next'
import { getSession, GetSessionParams } from 'next-auth/react'

export async function fetcher(url: string, context?: GetServerSidePropsContext) {
  const session = await getSession(context as GetSessionParams)
  const axiosOptions = { headers: { Authorization: `Bearer ${session?.accessToken}` } }
  const { data } = await axios.get(url, axiosOptions)
  return data
}

export async function fetchMutate(
  requestConfig: AxiosRequestConfig,
  context?: GetServerSidePropsContext
) {
  const session = await getSession(context as GetSessionParams)
  const axiosOptions: AxiosRequestConfig = {
    ...requestConfig,
    headers: { Authorization: `Bearer ${session?.accessToken}` },
  }
  const { data } = await axios(axiosOptions)
  return data
}
