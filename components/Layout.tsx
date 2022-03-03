import Image from 'next/image'
import NavMenu from './NavMenu'
import AvatarMenu from './AvatarMenu'
import { useRouter } from 'next/router'
import { IoCloudUpload } from 'react-icons/io5'
import { Box, Flex, Text, HStack, useColorMode, Button } from '@chakra-ui/react'

export default function Layout(props: { children: React.ReactNode }) {
  const router = useRouter()
  const { colorMode } = useColorMode()

  return (
    <Box>
      <Flex
        h='50px'
        align='center'
        borderBottomWidth='1px'
        justify='space-between'
        borderBottomStyle='solid'
        borderBottomColor={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
      >
        <Flex align='center'>
          <Flex
            pl='1'
            cursor='pointer'
            align='center'
            onClick={() => {
              router.push('/')
            }}
          >
            <Image src='/logo.png' width='40px' height='40px' alt='logo' />
            <Text fontSize='1rem' pl='2'>
              bken.io
            </Text>
          </Flex>
          <Box ml='4'>
            <NavMenu />
          </Box>
        </Flex>
        <HStack pr='1'>
          <Button
            size='sm'
            variant='ghost'
            leftIcon={<IoCloudUpload size='18px' />}
            onClick={() => router.push('/upload')}
          >
            Upload
          </Button>
          <AvatarMenu />
        </HStack>
      </Flex>
      <Box h='calc(100vh - 50px)' p='2'>
        {props.children}
      </Box>
    </Box>
  )
}
