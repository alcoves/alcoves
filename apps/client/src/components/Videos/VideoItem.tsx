import useSWRMutation from 'swr/mutation'

import { useSWRConfig } from 'swr'
import { Video } from '../../types'
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
    <Flex p="1" w="100%" justify="space-between">
      <Text>{video.id}</Text>
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
