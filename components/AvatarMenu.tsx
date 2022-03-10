import { Avatar, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { IoLogOutOutline, IoPersonOutline } from 'react-icons/io5'

import { userStore } from '../stores/user'

export default function AvatarMenu() {
  const { user, logout } = userStore()
  const router = useRouter()

  return (
    <Menu id='avatar-menu' isLazy>
      <MenuButton
        size='sm'
        as={Avatar}
        cursor='pointer'
        display='inline'
        src={user?.image}
        name={user?.username}
      />
      <MenuList>
        <MenuItem icon={<IoPersonOutline size='20px' />} onClick={() => router.push('/account')}>
          Account
        </MenuItem>
        <MenuItem icon={<IoLogOutOutline size='20px' />} onClick={logout}>
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
