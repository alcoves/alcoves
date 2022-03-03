import axios from 'axios'
import Card from '../Card'
import chunkFile from '../../utils/chunkFile'
import useLazyRequest from '../../hooks/useLazyRequest'
import { useEffect, useState } from 'react'
import { getAPIUrl } from '../../utils/urls'
import { IoCheckmarkCircle } from 'react-icons/io5'
import { useWarnIfUploading } from '../../hooks/useWarnIfUploading'
import { Flex, Progress, Spinner, Text, useTheme } from '@chakra-ui/react'

const bypassInterceptorAxios = axios.create()

export default function UploadVideo({ file }: { file: any }) {
  const theme = useTheme()

  const chunks = chunkFile(file)
  const [uploading, setUploading] = useState(false)
  const [bytesUploaded, setBytesUploaded] = useState(0)

  const [
    createVideoRequest,
    { data: createVideoData, error: createVideoError, loading: createVideoLoading },
  ] = useLazyRequest()
  const [
    createVideoUploadRequest,
    {
      data: createVideoUploadData,
      error: createVideoUploadError,
      loading: createVideoUploadLoading,
    },
  ] = useLazyRequest()
  const [
    completeVideoUploadRequest,
    {
      data: completeVideoUploadData,
      error: completeVideoUploadError,
      loading: completeVideoUploadLoading,
    },
  ] = useLazyRequest()

  useWarnIfUploading(uploading, () => {
    return confirm('Warning! You still have videos uploading!')
  })

  useEffect(() => {
    console.log('creating video')
    if (!createVideoData) {
      createVideoRequest({
        method: 'POST',
        data: { title: file.name },
        url: `${getAPIUrl()}/videos`,
      })
    }
  }, [])

  useEffect(() => {
    if (
      createVideoData &&
      !createVideoUploadData &&
      !createVideoUploadError &&
      !createVideoUploadLoading
    ) {
      const videoId = createVideoData.payload.id
      console.log('creating video upload', { videoId })
      createVideoUploadRequest({
        method: 'POST',
        data: { type: file.type, chunks: chunks.length },
        url: `${getAPIUrl()}/videos/${videoId}/upload`,
      })
    }
  }, [createVideoData, createVideoUploadData, createVideoUploadError, createVideoUploadLoading])

  useEffect(() => {
    const videoId = createVideoData?.payload?.id
    const upload = createVideoUploadData?.payload?.upload

    async function uploadChunks() {
      console.log('starting video upload')
      return Promise.all(
        chunks.map((chunk, i) => {
          console.log(`uploading part ${i} to ${upload.urls[i]}`)
          let lastBytesLoaded = 0
          return bypassInterceptorAxios.put(upload.urls[i], chunk, {
            onUploadProgress: e => {
              const deltaUploaded = e.loaded - lastBytesLoaded
              // console.log(e.loaded, deltaUploaded, lastBytesLoaded)
              setBytesUploaded(prev => (prev += deltaUploaded))
              lastBytesLoaded = e.loaded
            },
          })
        })
      )
    }

    if (!uploading && createVideoUploadData && !completeVideoUploadData) {
      console.log(createVideoUploadData, !uploading)
      setUploading(true)
      uploadChunks()
        .then(() => {
          completeVideoUploadRequest({
            method: 'PATCH',
            data: { key: upload.key, uploadId: upload.uploadId },
            url: `${getAPIUrl()}/videos/${videoId}/upload`,
          })
          setUploading(false)
        })
        .catch(error => {
          console.error('something failed while uploading chunks', error)
          setUploading(false)
        })
    }
  }, [createVideoUploadData])

  console.log(uploading)

  return (
    <Card>
      <Flex w='100%' direction='column' p='2'>
        <Flex justify='space-between' p='2'>
          <Text fontWeight={600}>{file.name}</Text>
          {!uploading ? (
            <IoCheckmarkCircle size='24px' color={theme.colors.teal['400']} />
          ) : (
            <Spinner />
          )}
        </Flex>

        <Progress
          mt='1'
          h='2px'
          w='100%'
          bg='transparent'
          colorScheme='teal'
          value={(bytesUploaded / file.size) * 100}
        />
      </Flex>
    </Card>
  )
}
