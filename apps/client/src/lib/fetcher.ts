import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const fetcher = (url: string) =>
  axios.get(url, { baseURL: API_URL }).then((res) => res.data)
