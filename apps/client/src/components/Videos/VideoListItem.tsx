import { Video } from '../../types'
import { Link } from 'react-router-dom'
import { Flex, Text } from '@chakra-ui/react'

export default function VideoListItem({ video }: { video: Video }) {
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
    </Flex>
  )
}
