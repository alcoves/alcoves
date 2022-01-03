import useSWR from 'swr'
import LibraryGrid from './LibraryGrid'
import UploadButton from '../UploadButton'
import { Box } from '@chakra-ui/react'
import { fetcher } from '../../utils/axios'

export default function Library() {
  const { data } = useSWR('http://localhost:4000/libraries', fetcher)
  const libraryId = data?.payload[0]?.id
  if (!libraryId) return null

  return (
    <Box p='4' w='100%'>
      <UploadButton expanded={false} />
      <LibraryGrid libraryId={libraryId} />
    </Box>
  )
}
