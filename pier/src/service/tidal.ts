import axios from 'axios'

export function dispatchJob(name: string, data: any) {
  const dispatchURL = `${process.env.TIDAL_URL}/jobs/${name}`
  console.log('dispatchURL', dispatchURL)
  return axios.post(dispatchURL, data)
}
