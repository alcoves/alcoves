import useSWR from 'swr'
import Link from 'next/link'
import { fetcher } from '../utils/fetcher'
import { Avatar, HStack } from '@chakra-ui/react'
import { getApiUrl } from '../utils/api'
import CreatePod from './CreatePod'

const fetchUrl = `${getApiUrl()}/pods`

export default function ListPods(): JSX.Element {
  const { data } = useSWR(fetchUrl, fetcher)
  return (
    <>
      <HStack h='100%' align='center'>
        {data?.data?.map((p: { _id: string; name: string }) => {
          return (
            <Link key={p._id} href={`/pods/${p._id}`} passHref>
              <Avatar name={p.name} size='sm' cursor='pointer' />
            </Link>
          )
        })}
        <CreatePod />
      </HStack>
    </>
  )
}
