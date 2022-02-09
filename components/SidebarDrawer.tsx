import {
  Drawer,
  IconButton,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/react'
import { useRef } from 'react'
import { IoMenu } from 'react-icons/io5'

export default function SidebarDrawer() {
  const btnRef = useRef()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <IconButton
        w='45px'
        ref={btnRef}
        variant='ghost'
        onClick={onOpen}
        aria-label='menu'
        icon={<IoMenu size='20px' />}
      />
      <Drawer placement='left' onClose={onClose} isOpen={isOpen} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader h='50px' borderBottomWidth='1px'>
            Basic Drawer
          </DrawerHeader>
          <DrawerBody>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
