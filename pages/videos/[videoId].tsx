import { useRouter } from 'next/router'
import Layout from '../../components/Layout/Layout'
import ListVideo from '../../components/Videos/ListVideo'

export default function ListVideoPage() {
  const router = useRouter()
  const { videoId } = router.query

  return (
    <Layout sidebar={false}>
      <ListVideo id={videoId} />
    </Layout>
  )
}
