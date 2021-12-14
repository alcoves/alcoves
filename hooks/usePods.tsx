import useSWR from 'swr'
import { useEffect, useState } from 'react'
import { fetcher } from '../utils/axios'

export default function usePods() {
  const { data, error } = useSWR(`http://localhost:4000/pods`, fetcher)
  return {
    data,
    isError: error,
    isLoading: !error && !data,
  }
}

export function usePod(podId: string | string[] | null | undefined): any {
  const [pod, setPod] = useState()
  const { data, error } = useSWR(`http://localhost:4000/pods`, fetcher)

  useEffect(() => {
    if (podId) {
      const selectedPod = data?.payload?.pods.filter(({ id }: any) => id === podId)
      if (selectedPod && selectedPod.length) {
        setPod(selectedPod[0])
      }
    }
  }, [podId, data])

  return {
    pod,
    isError: error,
    isLoading: !error && !data,
  }
}
