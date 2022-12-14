import axios from 'axios'

axios.interceptors.request.use(function (config) {
  if (config?.headers) {
    config.headers['x-api-key'] = process.env.TIDAL_API_KEY
  }
  return config
})

export default axios
