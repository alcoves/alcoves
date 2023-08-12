import useSWR from 'swr'
import { fetcher } from '../../lib/fetcher'

export default function Videos() {
  const { data, error, isLoading } = useSWR('/health', fetcher)

  console.log(data)

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  return <div>{data}!</div>
}
