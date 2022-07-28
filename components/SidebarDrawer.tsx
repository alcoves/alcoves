import {
  Box,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react'
import { useRef } from 'react'
import { IoMenu } from 'react-icons/io5'

import SidebarMenu from './SidebarMenu'

export default function SidebarDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef(null)

  return (
    <>
      <IconButton
        ref={btnRef}
        variant='ghost'
        colorScheme='teal'
        icon={<IoMenu />}
        onClick={onOpen}
        aria-label='sidebar'
      />
      <Drawer size='xs' isOpen={isOpen} placement='left' onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <Box h='50px' />
          <DrawerCloseButton />
          <SidebarMenu />
        </DrawerContent>
      </Drawer>
    </>
  )
}
