import { Box } from '@chakra-ui/react'

import Upload from './Upload/UploadButton'
import VideoGrid from './Videos/VideoGrid'

export default function Home() {
  return (
    <Box p='2'>
      <Upload />
      <VideoGrid />
    </Box>
  )
}
