import Layout from '../Layout/Layout'
import { useParams } from 'react-router-dom'

export default function VideoById() {
  const { id } = useParams()

  return id ? (
    <Layout>
      <h1>Video by id</h1>
      {id}
    </Layout>
  ) : null
}
