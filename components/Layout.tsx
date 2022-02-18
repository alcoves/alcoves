import NavMenu from './NavMenu'
import AvatarMenu from './AvatarMenu'
import UploadButton from './UploadButton'
import {
  Box,
  Flex,
  Text,
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
import { useEffect, useRef, useState } from 'react'
import { IoMenu } from 'react-icons/io5'

export default function Layout(props: { children: React.ReactNode }) {
  const btnRef = useRef(null)
  const [isLargerThan1000, setIsLargerThan1000] = useState(false)
  const [isLargerThan1000_MQ] = useMediaQuery('(min-width: 1000px)')
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Workaround for media query bug
  // https://github.com/chakra-ui/chakra-ui/issues/3124
  useEffect(() => {
    if (isLargerThan1000_MQ !== isLargerThan1000) {
      setIsLargerThan1000(isLargerThan1000_MQ)
    }
  }, [isLargerThan1000_MQ, isLargerThan1000])

  return (
    <Box>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent w='200px' maxW='200px'>
          <DrawerHeader h='50px' borderBottomWidth='1px' p='1'>
            <Flex align='center'>
              <IconButton
                w='45px'
                variant='ghost'
                onClick={onClose}
                aria-label='menu'
                icon={<IoMenu size='20px' />}
              />
              <Text fontSize='1rem' pl='2'>
                bken.io
              </Text>
            </Flex>
          </DrawerHeader>
          <DrawerBody p='1'>
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
          <Text fontSize='1rem' pl='2'>
            bken.io
          </Text>
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
          <Box h='calc(100vh - 50px)' w='100%' p='1' overflowY='scroll'>
            {props.children}
          </Box>
        </Flex>
      ) : (
        <Box h='calc(100vh - 50px)' w='100%' p='1' overflowY='scroll'>
          {props.children}
        </Box>
      )}
    </Box>
  )
}
