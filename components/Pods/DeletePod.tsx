import useLazyRequest from '../../hooks/useLazyRequest'
import { useRouter } from 'next/router'
import { getAPIUrl } from '../../utils/urls'
import { Box, Button } from '@chakra-ui/react'
import { IoRemoveCircleOutline } from 'react-icons/io5'
import { useSWRConfig } from 'swr'

export default function DeletePod({ id }: { id: string }) {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const [deletePod, { error, loading }] = useLazyRequest()

  async function handleDelete() {
    await deletePod({
      method: 'DELETE',
      url: `${getAPIUrl()}/pods/${id}`,
    })

    mutate(`${getAPIUrl()}/pods`)
    router.push('/')
  }

  return (
    <Box>
      <Button
        size='sm'
        colorScheme='red'
        isLoading={loading}
        onClick={handleDelete}
        leftIcon={<IoRemoveCircleOutline size='20px' />}
      >
        {error ? 'Failed!' : 'Delete Pod'}
      </Button>
    </Box>
  )
}
