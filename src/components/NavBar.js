import { useContext, } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pane, Avatar, Button, Menu, Popover, } from 'evergreen-ui';
import Icon from './icon';
import { Context, } from '../utils/store';

export default function Navigation() {
  const { user, authenticated, logout } = useContext(Context);

  return (
    <Pane
      height={50}
      width='100vw'
      display='flex'
      background='#fff'
      justifyContent='space-between'
    >
      <Pane
        display='flex'
        paddingLeft={10}
        width={70}
        alignItems='center'
        justifyContent='flex-start' 
      >
        <Link href='/'>
          <a>
            <Image
              alt='logo'
              width={40}
              height={40}
              src='/logo.png'
            />
          </a>
        </Link>
      </Pane>
      <Pane
        width={70}
        display='flex'
        paddingRight={10}
        alignItems='center'
        justifyContent='flex-end' 
      >
        {authenticated ? (
          <>
            <Pane marginRight={10}>
              <Link href='/upload' passHref>
                <a>
                  <Icon
                    width='24'
                    height='24'
                    fill='none'
                    strokeWidth='2'
                    name='upload-cloud'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </a>
              </Link>
            </Pane>
      
            <Link href='/account' passHref>
              <Popover
                content={(
                  <Menu>
                    <Menu.Group>
                      <Menu.Item disabled> Profile (coming soon) </Menu.Item>
                      <Link href='/studio'>
                        <Menu.Item>                 
                          Studio
                        </Menu.Item>
                      </Link>
                      <Link href='/account'>
                        <Menu.Item> 
                          Account
                        </Menu.Item>
                      </Link>
                    </Menu.Group>
                    <Menu.Divider />
                    <Menu.Group>
                      <Menu.Item onSelect={() => logout()} intent='danger'>
                        Log out
                      </Menu.Item>
                    </Menu.Group>
                  </Menu>
                )}
              >
                <Avatar cursor='pointer' name={user.username} size={35} />
              </Popover>
            </Link>
          </>
        )
          : (
            <Link href='/login' passHref>
              <Button appearance='minimal' height={24}> Login </Button>
            </Link>
          )}
      </Pane>
    </Pane>
  );
}