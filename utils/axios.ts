import Cookies from 'js-cookie'
import axios, { AxiosRequestConfig } from 'axios'

axios.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = Cookies.get('token')
  console.log(config)
  if (token && config?.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  console.log(config)
  return config
})

export default axios
