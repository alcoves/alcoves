import axios from '../utils/axios'
import { useState } from 'react'
import { AxiosRequestConfig } from 'axios'

export default function useLazyRequest(options?: AxiosRequestConfig): any {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function executeRequest(inputOverides: AxiosRequestConfig) {
    try {
      setLoading(true)
      const res = await axios({
        ...options,
        ...inputOverides,
      })
      setData(res.data)
    } catch (error: any) {
      setData(null)
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  return [executeRequest, { data, loading, error }]
}
