import { useState, } from 'react';
import { signOut, useSession, } from 'next-auth/client';
import { Flex, Spacer, Text, Switch, Box, Avatar, Img, Menu, MenuButton, MenuList, MenuItem, MenuDivider, useColorMode, IconButton, } from '@chakra-ui/react';
import { IoFilmOutline, } from 'react-icons/io5';
import isAdmin from '../utils/isAdmin';
import Link from 'next/link';
import Uploader from './Uploader/Index';

export default function Navigation() {
  const [session] = useSession();
  const [open, setOpen] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex h='48px' bg={colorMode === 'dark' ? 'gray.700' : 'white'}>
      <Box p='1'>
        <Link href='/'>
          <Img
            alt='Bken.io'
            boxSize='40px'
            cursor='pointer'
            src='/logo.png'
            objectFit='cover'
          />
        </Link>
      </Box>
      <Spacer />
      <Box p='1'>
        <Flex justify='center' align='center' h='100%'>
          <Box me='2'><Uploader/></Box>
          <Box me='2'>
            <Link href='/studio'>
              <IconButton
                size='sm'
                icon={<IoFilmOutline/>}
              />
            </Link>
          </Box>

          {session && session.user ?
            <Menu>
              <MenuButton me='10px'>
                <Avatar
                  h='30px' w='30px'
                  src={session.user.image}
                  name={session.user.name[0]}
                  onClick={() => setOpen(!open)}
                />
              </MenuButton>
              <MenuList minW='auto'>
                <Link href={`/u/${session.id}`}>
                  <MenuItem>Profile</MenuItem>
                </Link>
                <Link href={'/account'}>
                  <MenuItem>Account</MenuItem>
                </Link>
                {session?.id && isAdmin(session.id) &&
                  <Link href='/admin'>
                    <MenuItem>Admin</MenuItem>
                  </Link>
                }
                <MenuDivider />
                <MenuItem onClick={toggleColorMode} closeOnSelect={false}>
                  <Text>Dark Theme</Text>
                  <Switch
                    ml='2'
                    size='sm'
                    isChecked={colorMode === 'dark'}
                  />
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={signOut}>Log out</MenuItem>
              </MenuList>
            </Menu>
            :
            <Flex w='full' h='full' align='center' me='10px'>
              <Link href='/login'>
                <Avatar h='30px' w='30px' cursor='pointer' />
              </Link>
            </Flex>
          }
        </Flex>
      </Box>
    </Flex>
  );
}