import axios from 'axios'
import { getAPIUrl } from '../../utils/urls'
import { Box, Button } from '@chakra-ui/react'
import { IoRemoveCircleOutline } from 'react-icons/io5'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function DeletePod({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    try {
      setLoading(true)
      const deleteUrl = `${getAPIUrl()}/pods/${id}`
      await axios.delete(deleteUrl)
      setLoading(false)
      router.push('/pods')
    } catch (error) {
      setLoading(false)
      console.error(error)
      alert(error)
    }
  }

  return (
    <Box>
      <Button
        colorScheme='red'
        isLoading={loading}
        onClick={handleDelete}
        leftIcon={<IoRemoveCircleOutline size='20px' />}
      >
        Delete Pod
      </Button>
    </Box>
  )
}
