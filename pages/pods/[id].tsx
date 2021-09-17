import useSWR from 'swr'
import axios from 'axios'
import Layout from '../../components/Layout'

import { useRouter } from 'next/router'
import { getApiUrl } from '../../utils/api'
import { fetcher } from '../../utils/fetcher'
import { Spinner, Flex, Heading, HStack, Text, IconButton } from '@chakra-ui/react'
import { IoTrash } from 'react-icons/io5'
import { useSession } from 'next-auth/react'

export default function Pod(): JSX.Element {
  const { data: session } = useSession()
  const router = useRouter()
  const { id } = router.query
  const { data: pod } = useSWR(id ? `${getApiUrl()}/pods/${id}` : null, fetcher)

  async function deletePod() {
    try {
      console.log('Deleting pod')
      await axios.delete(`${getApiUrl()}/pods/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      })

      router.replace('/')
    } catch (error) {
      console.error(error)
    }
  }

  if (!pod?.data) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    )
  }

  return (
    <Layout>
      <Flex direction='column'>
        <Flex direction='column'>
          <Heading>{pod.data.name}</Heading>
          <Text>{pod.data._id}</Text>
          <HStack>
            <IconButton
              size='sm'
              colorScheme='red'
              onClick={deletePod}
              aria-label='delete-pod'
              icon={<IoTrash size='15px' />}
            />
          </HStack>
        </Flex>
        Here is the video grid component
      </Flex>
    </Layout>
  )
}
