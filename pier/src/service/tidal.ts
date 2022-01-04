import axios from 'axios'

export function dispatchJob(name: string, data: any) {
  return axios.post(`${process.env.TIDAL_URL}/jobs/${name}`, data)
}
