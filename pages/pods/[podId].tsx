import { useRouter } from 'next/router'

import Layout from '../../components/Layout'
import Pod from '../../components/Pods/Pod'

export default function Index() {
  const router = useRouter()
  const { podId } = router.query
  return <Layout>{podId && <Pod podId={podId as string} />}</Layout>
}
