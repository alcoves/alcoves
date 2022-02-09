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
import NavMenu from './NavMenu'

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
        </Flex>
        <HStack pr='1'>
          <UploadButton />
          <AvatarMenu />
        </HStack>
      </Flex>
      <Flex>
        {isLargerThan1000 && (
          <Flex borderRight='solid grey 1px' w='200px' maxW='200px'>
            <NavMenu />
          </Flex>
        )}
        <Flex w='100%' direction='column' overflowY='scroll'>
          <Flex h='calc(100vh - 50px)'>{props.children}</Flex>
        </Flex>
      </Flex>
    </Box>
  )
}
