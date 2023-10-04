import { useUser } from '../../contexts/UserContext'
import { Menu, MenuButton, MenuList, MenuItem, Avatar } from '@chakra-ui/react'

export default function Profile() {
  const { user, logout } = useUser()

  if (user) {
    return (
      <Menu>
        <Avatar size="sm" as={MenuButton} name={user?.username} />
        <MenuList mt="3">
          <MenuItem onClick={logout}>Logout</MenuItem>
        </MenuList>
      </Menu>
    )
  }

  return null
}
