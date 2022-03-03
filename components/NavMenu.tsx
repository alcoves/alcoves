import useSWR from 'swr'
import { useRouter } from 'next/router'
import { IoAddOutline, IoHomeOutline } from 'react-icons/io5'
import {
  Avatar,
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  MenuGroup,
  MenuDivider,
} from '@chakra-ui/react'
import { Pod } from '../types/types'
import { fetcher } from '../utils/axios'
import { getAPIUrl } from '../utils/urls'

export default function NavMenu() {
  const router = useRouter()
  const { data, error } = useSWR(`${getAPIUrl()}/pods`, fetcher)

  return (
    <Menu>
      <MenuButton
        size='sm'
        as={Button}
        variant='ghost'
        isLoading={!data && !error}
        leftIcon={<IoHomeOutline size='15px' />}
      >
        Home
      </MenuButton>
      <MenuList>
        <MenuGroup title='Pods'>
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
