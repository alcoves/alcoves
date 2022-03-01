import useSWR from 'swr'
import Layout from '../../../components/Layout'
import DeletePod from '../../../components/Pods/DeletePod'
import { useRouter } from 'next/router'
import { IoAdd } from 'react-icons/io5'
import { fetcher } from '../../../utils/axios'
import { Flex, Editable, EditablePreview, EditableInput, Button } from '@chakra-ui/react'
import { getAPIUrl } from '../../../utils/urls'

export default function PodPage() {
  const router = useRouter()
  const { data } = useSWR(
    router.query.id ? `${getAPIUrl()}/pods/${router.query.id}` : null,
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
        <Flex>
          <Button
            size='sm'
            leftIcon={<IoAdd />}
            onClick={() => router.push(`${router.asPath}/upload`)}
          >
            Add Media
          </Button>
          <DeletePod id={data?.payload?.id} />
        </Flex>
      </Layout>
    )
  }

  return null
}
