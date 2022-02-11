import NavMenu from './NavMenu'
import AvatarMenu from './AvatarMenu'
import UploadButton from './UploadButton'
import {
  Box,
  Flex,
  HStack,
  Drawer,
  DrawerBody,
  IconButton,
  DrawerHeader,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react'
import { useRef } from 'react'
import { IoMenu } from 'react-icons/io5'

export default function Layout(props: { children: React.ReactNode }) {
  const btnRef = useRef(null)
  const [isLargerThan1000] = useMediaQuery('(min-width: 1000px)')
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent w='200px' maxW='200px'>
          <DrawerHeader h='50px' borderBottomWidth='1px'>
            bken
          </DrawerHeader>
          <DrawerBody>
            <NavMenu />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Flex h='50px' justify='space-between' align='center'>
        <Flex align='center' pl='1'>
          {!isLargerThan1000 && (
            <IconButton
              w='45px'
              ref={btnRef}
              variant='ghost'
              onClick={onOpen}
              aria-label='menu'
              icon={<IoMenu size='20px' />}
            />
          )}
          <Box pl='2'>bken.io</Box>
        </Flex>
        <HStack pr='1'>
          <UploadButton />
          <AvatarMenu />
        </HStack>
      </Flex>
      {isLargerThan1000 ? (
        <Flex w='100%'>
          <Flex w='200px' maxW='200px' minW='200px'>
            <NavMenu />
          </Flex>
          <Flex h='calc(100vh - 50px)' w='100%' p='1' overflowY='auto'>
            {props.children}
          </Flex>
        </Flex>
      ) : (
        <Flex h='calc(100vh - 50px)' w='100%' p='1' overflowY='auto'>
          {props.children}
        </Flex>
      )}
    </Box>
  )
}
