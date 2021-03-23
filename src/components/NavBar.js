import { useState, } from 'react';
import { useRouter, } from 'next/router';
import { useSession, } from 'next-auth/client';
import { Flex, Spacer, Box, Avatar, Img, Menu, MenuButton, MenuList, MenuItem, } from '@chakra-ui/react';

export default function Navigation() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [session, loading] = useSession();

  return (
    <Flex h='55px' bg='teal.500'>
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
            <MenuButton>
              <Avatar
                name={session.user.name}
                src={session.user.image}
                onClick={() => setOpen(!open)}
              />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => router.push(`/u/${session.id}`)}>Profile</MenuItem>
              <MenuItem onClick={() => router.push('/studio')}>Studio</MenuItem>
              <MenuItem onClick={() => router.push('/account')}>Account</MenuItem>
            </MenuList>
          </Menu>
          :
          <Avatar
            onClick={() => router.push('/login')}
          />
        }
      </Box>
    </Flex>
  );
}