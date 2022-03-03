import useSWR from 'swr'
import Layout from '../../../components/Layout'
import DeletePod from '../../../components/Pods/DeletePod'
import ManageMembers from '../../../components/Pods/ManageMembers'
import { useRouter } from 'next/router'
import { IoAdd } from 'react-icons/io5'
import { fetcher } from '../../../utils/axios'
import { getAPIUrl } from '../../../utils/urls'
import { Flex, HStack, Editable, EditablePreview, EditableInput, Button } from '@chakra-ui/react'
import PodMediaGrid from '../../../components/Pods/MediaGrid'

export default function PodPage() {
  const router = useRouter()
  const { data } = useSWR(
    router.query.podId ? `${getAPIUrl()}/pods/${router.query.podId}` : null,
    fetcher
  )

  if (data?.payload) {
    return (
      <Layout>
        <Editable
          w='600px'
          fontSize='2xl'
          defaultValue={data?.payload?.name}
          onSubmit={value => {
            if (value !== data?.payload?.name) {
              // TODO :: Edit the title
              console.log('submit', value)
            }
          }}
        >
          <EditablePreview pl='2' />
          <EditableInput pl='2' />
        </Editable>
        <HStack mt='4'>
          <Button
            size='sm'
            leftIcon={<IoAdd />}
            onClick={() => router.push(`${router.asPath}/upload`)}
          >
            Add Media
          </Button>
          <ManageMembers />
          <DeletePod id={data?.payload?.id} />
        </HStack>
        <Flex mt='2' w='100%'>
          <PodMediaGrid podId={data?.payload?.id} />
        </Flex>
      </Layout>
    )
  }

  return null
}
