import { useContext } from 'react'
import { UserContext } from '../contexts/user'
import { IoMoon, IoSunny } from 'react-icons/io5'
import { Menu, MenuButton, MenuList, MenuItem, Avatar, Flex, useColorMode } from '@chakra-ui/react'

export default function AvatarMenu() {
  const { user, logout } = useContext(UserContext)
  const { colorMode, toggleColorMode } = useColorMode()

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
        <Flex h='30px' cursor='pointer' onClick={toggleColorMode} justify='center' mx='2'>
          {colorMode === 'dark' ? <IoMoon /> : <IoSunny />}
        </Flex>
        <MenuItem>Account</MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </MenuList>
    </Menu>
  )
}
