import { useState, } from 'react';
import { useRouter, } from 'next/router';
import { signOut, useSession, } from 'next-auth/client';
import { Button, Flex, Spacer, Box, Avatar, Img, Menu, MenuButton, MenuList, MenuItem, MenuDivider, } from '@chakra-ui/react';
import isAdmin from '../utils/isAdmin';

export default function Navigation() {
  const router = useRouter();
  const [session] = useSession();
  const [open, setOpen] = useState(false);

  return (
    <Flex h='48px' bg='gray.700'>
      <Box p='1'>
        <Img 
          alt='Bken.io'
          boxSize='40px'
          cursor='pointer'
          src='/logo.png'
          objectFit='cover'
          onClick={() => router.push('/')}
        />
      </Box>
      <Spacer />
      <Box p='1'>
        <Flex justify='center' align='center' h='100%'>
          <Button me='10px' size='sm' onClick={() => router.push('/studio')}>Studio</Button>
          {session && session.user ?
            <Menu>
              <MenuButton me='10px'>
                <Avatar
                  h='30px' w='30px'
                  name={session.user.name}
                  src={session.user.image}
                  onClick={() => setOpen(!open)}
                />
              </MenuButton>
              <MenuList minW='auto'>
                <MenuItem onClick={() => router.push(`/u/${session.id}`)}>Profile</MenuItem>
                <MenuItem onClick={() => router.push('/account')}>Account</MenuItem>
                {session?.id && isAdmin(session.id) && <MenuItem onClick={() => router.push('/admin')}>Admin</MenuItem>}
                <MenuDivider />
                <MenuItem onClick={signOut}>Log out</MenuItem>
              </MenuList>
            </Menu>
            :
            <Flex w='full' h='full' align='center'>
              <Avatar
                h='30px' w='30px'
                cursor='pointer'
                onClick={() => router.push('/login')}
              />
            </Flex>
          }

        </Flex>
      </Box>
    </Flex>
  );
}