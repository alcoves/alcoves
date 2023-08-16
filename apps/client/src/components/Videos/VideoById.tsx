import useSWR from 'swr'
import DeleteVideo from './DeleteVideo'

import { Video } from '../../types'
import { useParams } from 'react-router-dom'

export default function VideoById({ video }: { video?: Video }) {
  const { id } = useParams()
  const { data, error } = useSWR(`/videos/${id}`, {
    fallbackData: video,
  })

  if (error) {
    return <div>failed to load</div>
  }

  return data?.id ? (
    <>
      <h1>Video by id</h1>
      {data?.id}
      <DeleteVideo id={data.id} />
    </>
  ) : null
}
