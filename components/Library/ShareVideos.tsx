import { Box, IconButton } from '@chakra-ui/react'
import { IoShareOutline } from 'react-icons/io5'

export default function ShareVideos() {
  return (
    <Box>
      <IconButton
        colorScheme='teal'
        icon={<IoShareOutline size='20px' />}
        // onClick={onOpen}
        aria-label='share-selected'
        // isDisabled={!videoIds.length}
      />
    </Box>
  )
}
