import useSWRMutation from 'swr/mutation'

import { useSWRConfig } from 'swr'
import { Video } from '../../types'
import { Link } from 'react-router-dom'
import { deleteVideo } from '../../lib/api'
import { Button, Flex, Text } from '@chakra-ui/react'

export default function VideoItem({ video }: { video: Video }) {
  const { mutate } = useSWRConfig()
  const { trigger } = useSWRMutation(`/videos/${video.id}`, deleteVideo)

  async function handleDelete(id: string) {
    await trigger({ id })
    await mutate('/videos')
  }

  return (
    <Flex
      p="1"
      w="100%"
      as={Link}
      to={`/videos/${video.id}`}
      justify="space-between"
      border="1px"
      borderColor="gray.600"
      borderRadius="md"
    >
      <Flex>
        <video
          muted
          autoPlay
          width="100px"
          src={`http://localhost:4000/videos/${video.id}/stream`}
        />
        <Text>{video.id}</Text>
      </Flex>

      <Button
        size="sm"
        onClick={() => {
          handleDelete(video.id)
        }}
      >
        Delete
      </Button>
    </Flex>
  )
}
