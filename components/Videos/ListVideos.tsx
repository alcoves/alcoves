import { useRouter } from 'next/router'
import { getVideos } from '../../lib/api'
import { Video } from '../../types/types'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'

function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
}

export default function ListVideos() {
  const router = useRouter()

  const { isLoading, isError, data, error } = useQuery({
    enabled: router.isReady,
    queryKey: ['videos'],
    queryFn: async (): Promise<{ videos: Video[] }> => {
      const data = await getVideos()
      return data
    },
  })

  if (data?.videos?.length) {
    return (
      <Box w="100%" p="4">
        <Heading my="2">Files</Heading>
        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Date</Th>
                <Th>Size</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.videos?.map((video) => {
                return (
                  <Tr
                    key={video.id}
                    cursor="pointer"
                    _hover={{ bg: 'blue.600' }}
                    onClick={() => {
                      router.push(`${router.asPath}/${video.id}`)
                    }}
                  >
                    <Td>{video.title}</Td>
                    <Td>{new Date(video.authoredAt).toISOString()}</Td>
                    <Td>{bytesToSize(video.size)}</Td>
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
