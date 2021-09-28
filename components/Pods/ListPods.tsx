import useSWR from 'swr'
import { fetcher } from '../../utils/fetcher'
import { Box, Avatar, HStack, Tooltip } from '@chakra-ui/react'
import { getApiUrl } from '../../utils/api'
import CreatePod from './CreatePod'
import { useRouter } from 'next/router'

const fetchUrl = `${getApiUrl()}/pods`

export default function ListPods(): JSX.Element {
  const router = useRouter()
  const { data } = useSWR(fetchUrl, fetcher)
  return (
    <>
      <HStack h='100%' align='center'>
        {data?.data?.map((p: { _id: string; name: string }) => {
          return (
            <Tooltip key={p._id} label={p.name}>
              <Avatar
                size='sm'
                name={p.name}
                cursor='pointer'
                onClick={() => {
                  router.push(`/pods/${p._id}`)
                }}
              />
            </Tooltip>
          )
        })}
        <CreatePod />
      </HStack>
    </>
  )
}
