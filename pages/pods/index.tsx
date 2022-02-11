import useSWR from 'swr'
import Layout from '../../components/Layout'
import Pods from '../../components/Pods/Pods'
import { fetcher } from '../../utils/axios'

export default function PodsPage() {
  const { data } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/pods`, fetcher)
  return <Layout>{data && <Pods pods={data.payload} />}</Layout>
}
