import Layout from '../components/Layout/Layout'
import ListVideos from '../components/Videos/ListVideos'

import { getVideos } from '../lib/api'
import { Video } from '../types/types'
import { useQuery } from '@tanstack/react-query'

export default function ListVideosPage() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['videos'],
    queryFn: async (): Promise<{ videos: Video[] }> => {
      const data = await getVideos()
      return data
    },
  })

  return (
    <Layout>
      <ListVideos videos={data?.videos} />
    </Layout>
  )
}
