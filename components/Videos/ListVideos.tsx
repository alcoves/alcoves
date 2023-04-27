import { useRouter } from 'next/router'
import { Video } from '../../types/types'
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'

function megabytesToSize(bytes: number): string {
  bytes = bytes * 1024 * 1024 // We convert to bytes because the db stores in mb
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
}

export default function ListVideos({
  videos = [],
}: {
  videos: Video[] | undefined
}) {
  const router = useRouter()

  if (videos?.length) {
    return (
      <Box w="100%" p="4">
        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Date</Th>
                <Th>Size</Th>
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
                    <Td>{megabytesToSize(video.size)}</Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    )
  }

  return null
}
