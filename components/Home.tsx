import axios from 'axios'
import Layout from './Layout'
import { useRouter } from 'next/router'
import { useDropzone } from 'react-dropzone'
import React, { useCallback, useState } from 'react'
import { Flex, Heading, Progress, Text } from '@chakra-ui/react'
import { CreateVideoResponse, UploadResponse } from '../types/types'

const MAX_FILE_SIZE = 1024 * 1024 * 1024

export default function Home() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')

  const onDrop = useCallback(acceptedFiles => {
    console.log({ acceptedFiles })

    if (acceptedFiles.length) {
      handleUpload(acceptedFiles[0])
    }
  }, [])

  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    maxSize: MAX_FILE_SIZE,
    accept: {
      'video/*': [],
    },
  })

  const onUploadProgress = progressEvent => {
    const { loaded, total } = progressEvent
    let percent = Math.floor((loaded * 100) / total)
    if (percent < 100) {
      setProgress(percent)
      console.log(`${loaded} bytes of ${total} bytes. ${percent}%`)
    }
  }

  async function handleUpload(file: File) {
    try {
      setUploading(true)
      setStatusMessage('')

      const uploadResponse = await axios.post('/api/uploads')
      const { url, id: uploadId } = uploadResponse.data as UploadResponse

      await axios.put(url, file, {
        onUploadProgress: onUploadProgress,
      })

      const createVideoResponse = await axios.post('/api/videos', { uploadId })
      const { id: videoId } = createVideoResponse.data as CreateVideoResponse
      router.push(`/v/${videoId}`)
    } catch (error) {
      console.error('Error', error)
    }
  }

  if (uploading) {
    return (
      <Layout>
        <Flex w='100%' h='100%' justify='center'>
          <Flex w='300px' justify='center' direction='column' pt='4'>
            <Heading pb='2' size='md'>
              Uploading
            </Heading>
            <Progress rounded='sm' value={progress} w='100%' hasStripe isAnimated />
            <Text>{statusMessage}</Text>
          </Flex>
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout>
      <Flex {...getRootProps()} w='100%' h='100%' justify='center'>
        <input {...getInputProps()} />
        <Flex justify='center' direction='column' pt='4'>
          {isDragActive ? (
            <Heading size='md'>{`Let's get started!`}</Heading>
          ) : (
            <Heading size='md'>Drag a video file anywhere</Heading>
          )}
        </Flex>
      </Flex>
    </Layout>
  )
}
