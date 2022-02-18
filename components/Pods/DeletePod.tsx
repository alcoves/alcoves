import { Box, Button } from '@chakra-ui/react'
import { IoRemoveCircleOutline } from 'react-icons/io5'

export default function DeletePod() {
  function handleDelete() {
    console.log('Deleting pod')
  }

  return (
    <Box>
      <Button
        colorScheme='red'
        onClick={handleDelete}
        leftIcon={<IoRemoveCircleOutline size='20px' />}
      >
        Delete Pod
      </Button>
    </Box>
  )
}
