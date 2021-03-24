import { useState, } from 'react';
import { useRouter, } from 'next/router';
import { signOut, useSession, } from 'next-auth/client';
import { Flex, Spacer, Box, Avatar, Img, Menu, MenuButton, MenuList, MenuItem, } from '@chakra-ui/react';

export default function Navigation() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [session, loading] = useSession();

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
        {session && session.user ?
          <Menu>
            <MenuButton h='100%'>
              <Avatar
                h='30px' w='30px'
                name={session.user.name}
                src={session.user.image}
                onClick={() => setOpen(!open)}
              />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => router.push(`/u/${session.id}`)}>Profile</MenuItem>
              <MenuItem onClick={() => router.push('/studio')}>Studio</MenuItem>
              <MenuItem onClick={() => router.push('/account')}>Account</MenuItem>
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
      </Box>
    </Flex>
  );
}