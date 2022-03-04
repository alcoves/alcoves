import { Avatar, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { IoLogOutOutline, IoPersonOutline } from 'react-icons/io5'
import { UserContext } from '../contexts/user'
import { useContext } from 'react'
import { useRouter } from 'next/router'

export default function AvatarMenu() {
  const router = useRouter()
  const { user, logout } = useContext(UserContext)

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
