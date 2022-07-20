import { Box, ResponsiveValue } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import { Video } from '../../types/types'

import VideoFrame from './VideoFrame'

export default function Player({ v }: { v: Video }) {
  const [width, setWidth] = useState(1280)
  const [visible, setVisible] = useState('hidden' as ResponsiveValue<DocumentVisibilityState>)

  useEffect(() => {
    function handleResize() {
      let height
      const w = v.width
      const h = v.height
      const minH = 200
      const padding = 200

      if (h > window.innerHeight - padding) {
        height = window.innerHeight - padding
        const minHeight = h < minH ? h : minH
        if (height < minHeight) {
          height = minHeight
        }
      } else {
        height = h
      }

      setWidth((w / h) * height)
      setVisible('visible')
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const paddingBottom = `${(v.height / v.width) * 100}%`

  return (
    <Box
      rounded='md'
      visibility={visible}
      margin='0px auto'
      position='relative'
      maxW={`${width}px`}
      overflow='hidden'
      boxShadow='#0000008a 0 0 40px'
    >
      <Box w='100%' paddingBottom={paddingBottom} maxW={`${width}px`}>
        <Box position='absolute' top='0px' left='0px' right='0px' bottom='0px'>
          <VideoFrame v={v} muted={false} autoplay={true} />
        </Box>
      </Box>
    </Box>
  )
}
