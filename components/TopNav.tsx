import AvatarMenu from './AvatarMenu'
import UploadButton from './UploadButton'
import SidebarDrawer from './SidebarDrawer'
import { Flex, HStack } from '@chakra-ui/react'

export default function TopNav() {
  return (
    <Flex h='50px' justify='space-between' align='center'>
      <Flex align='center'>
        <SidebarDrawer />
      </Flex>
      <HStack pr='1'>
        <UploadButton />
        <AvatarMenu />
      </HStack>
    </Flex>
  )
}
