import { useRouter } from 'next/router'
import { Video } from '../../types/types'
import {
  Box,
  Flex,
  HStack,
  Heading,
  SimpleGrid,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { apiUrl } from '../../lib/api'
import Link from 'next/link'
import { formatDuration, groupItemsByDay } from '../../lib/util'

export default function ListVideos({
  videos = [],
}: {
  videos: Video[] | undefined
}) {
  const router = useRouter()

  const groupedVideos = groupItemsByDay(videos)
  console.log(groupedVideos)

  if (videos?.length) {
    return (
      <Box w="100%" p="4">
        {/* <TableContainer>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Date</Th>
                <Th>Size</Th>
                <Th>Duration</Th>
              </Tr>
            </Thead>
            <Tbody>
              {videos.map((video) => {
                return (
                  <Tr
                    key={video.id}
                    cursor="pointer"
                    _hover={{ bg: 'blue.600' }}
                    onClick={() => {
                      router.push(`/videos/${video.id}`)
                    }}
                  >
                    <Td>{video.title}</Td>
                    <Td>{new Date(video.authoredAt).toISOString()}</Td>
                    <Td>{megabytesToSize(video.playbacks?.[0]?.size)}</Td>
                    <Td>{video.playbacks?.[0]?.duration}</Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer> */}

        {Object.entries(groupedVideos).map(([timestamp, videos]) => {
          return (
            <Box key={timestamp}>
              <Heading fontWeight="black" size="lg" py="2">
                {timestamp}
              </Heading>
              <SimpleGrid minChildWidth="360px" spacing={2}>
                {videos.map((video) => {
                  const thumbnailId = video.thumbnails?.[0]?.id
                  const cardImageUrl = `${apiUrl}/videos/${video.id}/thumbnails/${thumbnailId}`
                  return (
                    <Flex
                      as={Link}
                      key={video.id}
                      minW="360px"
                      h="200px"
                      borderRadius="md"
                      align="end"
                      backgroundColor="gray.700"
                      backgroundSize={'cover'}
                      backgroundPosition="center"
                      backgroundRepeat="no-repeat"
                      href={`/videos/${video.id}`}
                      backgroundImage={`url("${cardImageUrl}")`}
                      boxShadow="1px -60px 50px -30px rgba(0,0,0,0.85) inset"
                    >
                      <Flex direction="column" w="100%" p="1">
                        <Flex>
                          <Heading size="sm">{video.title}</Heading>
                        </Flex>
                        <Flex pt="1" justify="space-between" align="end">
                          <HStack spacing={1}>
                            {video.tags.map((tag) => (
                              <Tag
                                fontSize=".7rem"
                                fontWeight="bold"
                                size="sm"
                                key={tag.id}
                                variant="solid"
                                colorScheme="teal"
                                background="blue.600"
                              >
                                {tag.name}
                              </Tag>
                            ))}
                          </HStack>
                          <Tag
                            size="sm"
                            variant="solid"
                            fontSize=".7rem"
                            fontWeight="bold"
                            colorScheme="black"
                          >
                            {formatDuration(video?.playbacks?.[0]?.duration)}
                          </Tag>
                        </Flex>
                      </Flex>
                    </Flex>
                  )
                })}
              </SimpleGrid>
            </Box>
          )
        })}
      </Box>
    )
  }

  return null
}
