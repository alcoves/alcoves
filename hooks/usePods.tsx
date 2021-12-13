import useSWR from 'swr'
import { fetcher } from '../utils/axios'

export default function usePods() {
  const { data, error } = useSWR(`http://localhost:4000/pods`, fetcher)
  return {
    data,
    isError: error,
    isLoading: !error && !data,
  }
}
