import { Box, useColorMode } from '@chakra-ui/react'

export default function Card({ children }: { children: any }) {
  const { colorMode } = useColorMode()
  const cardBg = colorMode === 'dark' ? 'gray.700' : 'gray.200'
  return (
    <Box w='100%' h='100%' rounded='md' bg={cardBg}>
      {children}
    </Box>
  )
}
