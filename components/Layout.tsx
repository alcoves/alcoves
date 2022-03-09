import { Box, Flex, HStack, Text, useColorMode } from '@chakra-ui/react'
import Image from 'next/image'
import { useRouter } from 'next/router'

import AvatarMenu from './AvatarMenu'
import NavMenu from './NavMenu'
import UploadToast from './Upload/UploadToast'

export default function Layout(props: { children: React.ReactNode }) {
  const router = useRouter()
  const { colorMode } = useColorMode()

  return (
    <Box>
      <UploadToast />
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
          <AvatarMenu />
        </HStack>
      </Flex>
      <Box h='calc(100vh - 50px)' p='2'>
        {props.children}
      </Box>
    </Box>
  )
}
