import useSWR from 'swr'
import LibraryGrid from './LibraryGrid'
import { Box } from '@chakra-ui/react'
import { fetcher } from '../../utils/axios'
import { getAPIUrl } from '../../utils/urls'

export default function Library() {
  const { data } = useSWR(`${getAPIUrl()}/libraries`, fetcher)
  const libraryId = data?.payload[0]?.id
  if (!libraryId) return null

  return (
    <Box w='100%'>
      <LibraryGrid libraryId={libraryId} />
    </Box>
  )
}
