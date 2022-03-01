import { Box, Flex, Heading, Input, useColorMode, VStack } from '@chakra-ui/react'
import Layout from '../../../components/Layout'

export default function Submit() {
  const { colorMode } = useColorMode()

  return (
    <Layout>
      <Flex w='100%' direction='column' align='center'>
        <Box w='600px'>
          <Heading size='lg' my='2'>
            Create Post
          </Heading>
          <VStack spacing='2'>
            <Input variant='filled' placeholder='Title' />
            <Input variant='filled' placeholder='Description' />
            <Box
              p='2'
              w='100%'
              rounded='md'
              bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.100'}
            >
              test
            </Box>
          </VStack>
        </Box>
      </Flex>
    </Layout>
  )
}
