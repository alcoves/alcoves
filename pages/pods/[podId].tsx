import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import DeletePod from '../../components/Pods/DeletePod'

export default function Pod() {
  const router = useRouter()
  const podId = router?.query?.podId as string

  return (
    <Layout>
      <DeletePod id={podId} />
    </Layout>
  )
}
