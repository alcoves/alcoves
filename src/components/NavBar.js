import { useContext, } from 'react';
import Image from 'next/image';
import { useRouter, } from 'next/router';
import { Menu, Box, } from 'grommet';
import Icon from './Icon';
import { Context, } from '../utils/store';

export default function Navigation() {
  const router = useRouter();
  const { authenticated, logout } = useContext(Context);

  return (
    <Box
      height='50px'
      width='100%'
      margin='none'
      direction='row'
      justify='between'
      background='#192228'
    >
      <Box
        height='50px'
        width='70px'
        direction='row'
        align='center'
        justify='start'
      >
        <Image
          alt='logo'
          width={40}
          height={40}
          src='/logo.png'
          onClick={() => router.push('/')}
        />
      </Box>
      <Box
        width='auto'
        direction='row'
        margin='xsmall'
        align='center'
        justify='end' 
      >
        {authenticated ? (
          <>
            <Icon
              width='24'
              height='24'
              fill='none'
              strokeWidth='2'
              stroke='white'
              name='upload-cloud'
              strokeLinecap='round'
              strokeLinejoin='round'
              onClick={() => router.push('/upload')}
            />
            <Menu
              icon={<Icon name='user' />}
              items={[
                { label: 'Profile (Coming soon!)', onClick: () => {} },
                { label: 'Studio', onClick: () => router.push('/studio') },
                { label: 'Account (Coming soon!)', onClick: () => {} },
                { label: 'Log Out', onClick: () => logout() },
              ]}
            />
          </>
        )
          : (
            <Icon
              width='24'
              height='24'
              name='user'
              stroke='white'
              style={{ cursor:'pointer' }}
              onClick={() => router.push('/login')}
            />
          )}
      </Box>
    </Box>
  );
}