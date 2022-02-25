import { useState } from 'react'
import { getAPIUrl } from '../../utils/urls'
import { Box, Button } from '@chakra-ui/react'

export default function CreatePod() {
  const [isLoading, setIsLoading] = useState(false)

  // Create popup dialog and gather pod name

  async function handleCreate() {
    try {
      const APIUrl = `${getAPIUrl()}/pods`
      // await axios.post(APIUrl)
    } catch (error) {
      alert(error)
    }
  }

  return (
    <Box>
      <Button isLoading={isLoading} variant='ghost'>
        Create Pod
      </Button>
    </Box>
  )
}
