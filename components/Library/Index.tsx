import useSWR from 'swr'
import LibraryGrid from './LibraryGrid'
import { Box } from '@chakra-ui/react'
import { fetcher } from '../../utils/axios'

export default function Library() {
  const { data } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/libraries`, fetcher)
  const libraryId = data?.payload[0]?.id
  if (!libraryId) return null

  return (
    <Box p='4' w='100%'>
      <LibraryGrid libraryId={libraryId} />
    </Box>
  )
}
