import { useRouter } from 'next/router'
import { IoAddOutline, IoBookOutline, IoHomeOutline } from 'react-icons/io5'
import {
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  MenuGroup,
  MenuDivider,
} from '@chakra-ui/react'

export default function NavMenu() {
  const router = useRouter()

  return (
    <Menu>
      <MenuButton variant='ghost' size='sm' as={Button} leftIcon={<IoHomeOutline size='15px' />}>
        Home
      </MenuButton>
      <MenuList>
        <MenuGroup title='Pods'>
          <MenuItem
            icon={<IoAddOutline size='20px' />}
            onClick={() => {
              router.push('/pods/create')
            }}
          >
            Create Pod
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuItem
          onClick={() => {
            router.push('/about')
          }}
        >
          About
        </MenuItem>
        <MenuItem
          onClick={() => {
            router.push('/terms')
          }}
        >
          Terms
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
