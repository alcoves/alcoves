import React, { useEffect, useState } from 'react'
import { Flex, Progress, Text } from '@chakra-ui/react'
import * as UpChunk from '@mux/upchunk'

export default function Upload({ file }: { file: File }) {
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    handleUpload()
  }, [])

  async function handleUpload() {
    try {
      const response = await fetch('/api/upload', { method: 'POST' })
      const { url } = await response.json()

      const upload = UpChunk.createUpload({
        file, // File object with your video file’s properties
        endpoint: url, // Authenticated url
        chunkSize: 1024, // Uploads the file in ~1 MB chunks
      })

      // Subscribe to events
      upload.on('error', error => {
        setStatusMessage(error.detail)
      })

      upload.on('progress', progress => {
        setProgress(progress.detail)
      })

      upload.on('success', () => {
        setStatusMessage("Wrap it up, we're done here. 👋")
      })
    } catch (error) {
      console.error('Error', error)
      // setStatusMessage(error)
    }
  }

  return (
    <Flex>
      <Flex>{JSON.stringify(file)}</Flex>

      <Progress value={progress} />
      <Text>{statusMessage}</Text>
    </Flex>
  )
}
