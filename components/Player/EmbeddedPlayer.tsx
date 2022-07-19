import { Box } from '@chakra-ui/react'

import { Video } from '../../types/types'

import VideoFrame from './VideoFrame'

export default function EmbeddedPlayer({ v }: { v: Video }) {
  const height = `${(v.height / v.width) * 100}vw`
  const maxWidth = `${(v.width / v.height) * 100}vh`

  return (
    <Box
      h={height}
      maxW={maxWidth}
      w='100vw'
      maxH='100vh'
      margin='auto'
      position='absolute'
      top='0'
      left='0'
      bottom='0'
      right='0'
      overflow='hidden'
      lineHeight='0'
    >
      <Box position='absolute' top='0px' left='0px' right='0px' bottom='0px'>
        <VideoFrame v={v} />
      </Box>
    </Box>
  )
}
