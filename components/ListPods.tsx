import useSWR from 'swr'
import Link from 'next/link'
import { fetcher } from '../utils/fetcher'
import { Avatar, HStack, IconButton } from '@chakra-ui/react'
import { IoAdd } from 'react-icons/io5'
import { getApiUrl } from '../utils/api'

export default function ListPods() {
  const fetchUrl = `${getApiUrl()}/pods`
  const { data } = useSWR(fetchUrl, fetcher)

  return (
    <HStack h='100%' align='center'>
      {data?.payload?.map(p => {
        return (
          <Link key={p._id} href={`/pods/${p._id}`} passHref>
            <Avatar name={p.name} size='sm' cursor='pointer' />
          </Link>
        )
      })}
      <IconButton
        size='sm'
        colorScheme='gray'
        aria-label='Create Pod'
        icon={<IoAdd size='25px' />}
      />
    </HStack>
  )
}
