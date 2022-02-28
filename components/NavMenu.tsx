import { useRouter } from 'next/router'
import { IoHomeOutline } from 'react-icons/io5'
import { Button, Menu, MenuItem, MenuList, MenuButton, MenuGroup } from '@chakra-ui/react'

export default function NavMenu() {
  const router = useRouter()

  return (
    <Menu>
      <MenuButton variant='ghost' size='sm' as={Button} leftIcon={<IoHomeOutline />}>
        Home
      </MenuButton>
      <MenuList>
        <MenuGroup title='Events'>
          <MenuItem
            onClick={() => {
              router.push('/events/russian-ukranian-war')
            }}
          >
            Russian Ukranian War
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  )
}
