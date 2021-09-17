import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import {
  Flex,
  Spacer,
  Text,
  Switch,
  Box,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorMode,
} from '@chakra-ui/react'
import Link from 'next/link'
import Image from 'next/image'
import ListPods from './ListPods'

export default function Navigation() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
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
      {session && session.user && <ListPods />}
      <Spacer />
      <Box p='1'>
        <Flex justify='center' align='center' h='100%'>
          {session && session.user ? (
            <Menu>
              <MenuButton me='10px'>
                <Avatar
                  h='30px'
                  w='30px'
                  src={session.user.image}
                  name={session.user.name[0]}
                  onClick={() => setOpen(!open)}
                />
              </MenuButton>
              <MenuList minW='auto'>
                <MenuItem onClick={toggleColorMode} closeOnSelect={false}>
                  <Text>Dark Theme</Text>
                  <Switch ml='2' size='sm' isChecked={colorMode === 'dark'} />
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={signOut}>Log out</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Flex w='full' h='full' align='center' me='10px'>
              <Link passHref href='/login'>
                <Avatar h='30px' w='30px' cursor='pointer' />
              </Link>
            </Flex>
          )}
        </Flex>
      </Box>
    </Flex>
  )
}
