import React from 'react'
import { Box } from '@chakra-ui/react'

export default function Layout(props) {
  return (
    <Box h='100vh' w='100vw'>
      {props.children}
    </Box>
  )
}
