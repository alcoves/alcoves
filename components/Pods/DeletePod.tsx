import { IconButton } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { IoTrash } from 'react-icons/io5'
import { useSWRConfig } from 'swr'
import { getApiUrl } from '../../utils/api'
import { fetchMutate } from '../../utils/fetcher'

interface DeletePodProps {
  id: string
}

export function DeletePod(props: DeletePodProps): JSX.Element {
  const { id } = props
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const [loading, setLoading] = useState(false)

  async function deletePod() {
    try {
      setLoading(true)
      await fetchMutate({
        method: 'delete',
        url: `${getApiUrl()}/pods/${id}`,
      })
      router.replace('/')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
      mutate(`${getApiUrl()}/pods`)
    }
  }

  return (
    <IconButton
      size='sm'
      loading={loading}
      colorScheme='red'
      onClick={deletePod}
      aria-label='delete-pod'
      icon={<IoTrash size='15px' />}
    />
  )
}
