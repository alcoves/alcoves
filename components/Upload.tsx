import { Upload } from '../types/types'
import { Box, Progress, Text } from '@chakra-ui/react'

export default function UploadItem({ upload }: { upload: Upload }) {
  const progress = (upload.completed / upload.file.size) * 100
  return (
    <Box bg='gray.900' rounded='sm'>
      <Box p='2'>
        <Text>{upload.file.name}</Text>
      </Box>
      <Progress h='1' value={progress} />
    </Box>
  )
}