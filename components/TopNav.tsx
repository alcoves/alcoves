import AvatarMenu from './AvatarMenu'
import { IoMoon, IoSunny } from 'react-icons/io5'
import { Flex, useColorMode } from '@chakra-ui/react'

export default function Navigation() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Flex h='48px' w='100%' justify='flex-end'>
      <Flex justify='center' align='center' pr='1'>
        <Flex cursor='pointer' onClick={toggleColorMode} justify='center' mx='2'>
          {colorMode === 'dark' ? <IoMoon /> : <IoSunny />}
        </Flex>
        <AvatarMenu />
      </Flex>
    </Flex>
  )
}
