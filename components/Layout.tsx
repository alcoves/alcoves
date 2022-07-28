import { Box, Flex, HStack, Text, useColorMode } from '@chakra-ui/react'
import Image from 'next/image'
import { useRouter } from 'next/router'

import AvatarMenu from './AvatarMenu'
import SidebarDrawer from './SidebarDrawer'
import SidebarMenu from './SidebarMenu'
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
            <Box display={['inline', 'inline', 'none']}>
              <SidebarDrawer />
            </Box>
            <Image src='/logo.png' width='40px' height='40px' alt='logo' />
            <Text fontSize='1rem' pl='2'>
              bken.io
            </Text>
          </Flex>
        </Flex>
        <HStack pr='2'>
          <AvatarMenu />
        </HStack>
      </Flex>
      <Flex h='calc(100vh - 50px)'>
        <Box w='200px' display={['none', 'none', 'inline']}>
          <SidebarMenu />
        </Box>
        <Box w='100%' overflowY='auto'>
          {props.children}
        </Box>
      </Flex>
    </Box>
  )
}
