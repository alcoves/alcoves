// import useSWR from 'swr'
import { BiAnchor } from 'react-icons/bi'
import {
  // Avatar,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  // MenuGroup,
  // MenuDivider,
} from '@chakra-ui/react'
import { IoHomeOutline } from 'react-icons/io5'
import { useRouter } from 'next/router'
// import { Pod } from '../types/types'
// import { fetcher } from '../utils/axios'
// import { getAPIUrl } from '../utils/urls'

export default function NavMenu() {
  const router = useRouter()
  // const { data, error } = useSWR(`${getAPIUrl()}/pods`, fetcher)

  return (
    <Menu>
      <MenuButton
        size='sm'
        as={Button}
        variant='ghost'
        // isLoading={!data && !error}
        leftIcon={<IoHomeOutline size='15px' />}
      >
        Home
      </MenuButton>
      <MenuList>
        <MenuItem
          icon={<BiAnchor size='24px' />}
          onClick={() => {
            router.push('/')
          }}
        >
          My Library
        </MenuItem>
        {/* <MenuGroup title='Pods'>
          <MenuItem
            icon={<IoAddOutline size='24px' />}
            onClick={() => {
              router.push('/pods/create')
            }}
          >
            Create Pod
          </MenuItem>
          {data?.payload?.map((pod: Pod) => {
            return (
              <MenuItem
                icon={<Avatar size='xs' name={pod.name} />}
                key={pod.id}
                onClick={() => {
                  router.push(`/pods/${pod.id}`)
                }}
              >
                {pod.name}
              </MenuItem>
            )
          })}
        </MenuGroup>
        <MenuDivider /> */}
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
