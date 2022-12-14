import axios from 'axios'
import Layout from './Layout'
import { useDropzone } from 'react-dropzone'
import React, { useCallback, useState } from 'react'
import { Flex, Heading, Progress, Text } from '@chakra-ui/react'

const MAX_FILE_SIZE = 1024 * 1024 * 1024

export default function Home() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')

  const onDrop = useCallback(acceptedFiles => {
    console.log({ acceptedFiles })

    if (acceptedFiles.length) {
      handleUpload(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
    accept: {
      'video/*': [],
    },
  })

  const onUploadProgress = progressEvent => {
    const { loaded, total } = progressEvent
    let percent = Math.floor((loaded * 100) / total)
    if (percent < 100) {
      console.log(`${loaded} bytes of ${total} bytes. ${percent}%`)
    }
  }

  async function handleUpload(file: File) {
    try {
      setUploading(true)
      setStatusMessage('')
      const response = await fetch('/api/uploads', { method: 'POST' })
      const { url } = await response.json()

      await axios.put(url, file, {
        onUploadProgress: onUploadProgress,
      })
    } catch (error) {
      console.error('Error', error)
    }
  }

  if (uploading) {
    return (
      <Layout>
        <Flex w='400px' direction='column'>
          <Progress value={progress} w='100%' />
          <Text>{statusMessage}</Text>
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout>
      <Flex {...getRootProps()} border='solid red 1px'>
        <input {...getInputProps()} />
        <Flex direction='column' pt='10'>
          <Heading>Drag file here or</Heading>
          <Heading>click anywhere to upload</Heading>
        </Flex>
      </Flex>
    </Layout>
  )
}
