import { useState } from 'react'
import {
  Flex,
  Spacer,
  Box,
  useColorMode,
} from '@chakra-ui/react'
import Link from 'next/link'
import Image from 'next/image'
import { IoMoon, IoSunny } from 'react-icons/io5'

export default function Navigation() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Flex h='48px' bg={colorMode === 'dark' ? 'gray.900' : 'white'}>
      <Box p='1' cursor='pointer'>
        <Link href='/'>
          <a>
            <Image
              width={40}
              height={40}
              quality={85}
              alt='Bken.io'
              layout='fixed'
              src='/logo.png'
            />
          </a>
        </Link>
      </Box>
      <Spacer />
      <Box p='1'>
        <Flex justify='center' align='center' h='100%'>
          <Flex cursor='pointer' onClick={toggleColorMode} justify='center' mx='4'>
            {colorMode === 'dark' ? <IoMoon /> : <IoSunny />}
          </Flex>
        </Flex>
      </Box>
    </Flex>
  )
}
