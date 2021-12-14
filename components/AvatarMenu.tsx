import { useContext } from 'react'
import { UserContext } from '../contexts/user'
import { Menu, MenuButton, MenuList, MenuItem, Avatar } from '@chakra-ui/react'

export default function AvatarMenu() {
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
        <MenuItem>Account</MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </MenuList>
    </Menu>
  )
}
