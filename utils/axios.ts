import Cookies from 'js-cookie'
import axios, { AxiosRequestConfig } from 'axios'

axios.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = Cookies.get('token')
  if (token && config?.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axios
export const fetcher = (url: string) => axios.get(url).then(res => res.data)
