import useSWRMutation from 'swr/mutation'

import { mutate } from 'swr'
import { Button } from '@chakra-ui/react'
import { deleteVideo } from '../../lib/api'
import { useNavigate } from 'react-router-dom'

export default function DeleteVideo({ id }: { id: string }) {
  const navigate = useNavigate()
  const { trigger, isMutating } = useSWRMutation(`/videos/${id}`, deleteVideo)

  async function handleDelete(id: string) {
    await trigger({ id })
    await mutate('/videos')
    await navigate('/') // Go to home page
  }

  return (
    <Button
      size="sm"
      colorScheme="red"
      isLoading={isMutating}
      onClick={() => {
        handleDelete(id)
      }}
    >
      Delete
    </Button>
  )
}
