import useSWRMutation from 'swr/mutation'

import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { createVideo } from '../../lib/api'
import { isValidURL } from '../../lib/util'
import { Box, Button, Heading, Input, Text, VStack } from '@chakra-ui/react'

const SAMPLE_VID =
  'https://s3.aa.rustyguts.net/development/2021-12-27_00-15-06.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=SA1NIHOA8N22PQLVZYE8%2F20230822%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230822T050040Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJTQTFOSUhPQThOMjJQUUxWWllFOCIsImV4cCI6MTY5MjcyMzYzMiwicGFyZW50IjoicnVzdHkifQ.2bIvr90AbVYPa7cJGrwkn0HRqbkLrM24uryEQd8Y2Njh4tcPOPr55AINYhPJNY1QnPiC6XaF8JzeeQypS7vMBQ&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=b7c8f7c32e805e5010285244c99d2af756bdecb2294b51eb83a3005b5f450708'

export default function UploadPanel() {
  const [link, setLink] = useState(SAMPLE_VID)
  const { mutate } = useSWRConfig()
  const { trigger } = useSWRMutation('/videos', createVideo)

  async function handleUpload() {
    await trigger(link)
    await mutate('/videos')
  }

  return (
    <Box
      p="4"
      rounded="lg"
      maxW="720px"
      borderWidth="2px"
      borderColor="gray.700"
    >
      <VStack align="start" w="100%">
        <Heading size="md">Upload from link</Heading>
        <Text>The provided link must contain a playable video</Text>
        <Input
          size="sm"
          rounded="lg"
          value={link}
          variant="filled"
          placeholder="http://example.com/video.mp4"
          onChange={(e) => setLink(e.target.value)}
        />
        <Button size="sm" isDisabled={!isValidURL(link)} onClick={handleUpload}>
          Upload
        </Button>
      </VStack>
    </Box>
  )
}
