import { Flex, Progress, Text } from '@chakra-ui/react'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'

import { uploadsStore } from '../../stores/uploads'
import chunkFile from '../../utils/chunkFile'
import { getAPIUrl } from '../../utils/urls'

const bypassInterceptorAxios = axios.create()

export default function UploadVideo({ id, file }: { id: string; file: File }) {
  const { mutate } = useSWRConfig()
  const { uploads, remove } = uploadsStore()
  const [status, setStatus] = useState('waiting')
  const [bytesUploaded, setBytesUploaded] = useState(0)
  const index = uploads.findIndex(u => u.id === id)

  const deleteItem = useCallback(() => {
    remove(index)
    mutate(`${getAPIUrl()}/videos`)
  }, [index, mutate, remove])

  useEffect(() => {
    async function uploadVideo() {
      try {
        const chunks = chunkFile(file)
        setStatus('Creating video')
        const createRes = await axios({
          method: 'POST',
          data: { title: file.name },
          url: `${getAPIUrl()}/videos`,
        })

        const videoId = createRes.data?.payload?.id
        setStatus('Creating upload')
        const createVudeoUploadRes = await axios({
          method: 'POST',
          data: { type: file.type, chunks: chunks.length },
          url: `${getAPIUrl()}/videos/${videoId}/upload`,
        })

        const createUploadRes = createVudeoUploadRes.data?.payload?.upload
        setStatus('Uploading parts')
        await Promise.all(
          chunks.map((chunk, i) => {
            // console.log(`uploading part ${i} to ${createUploadRes.urls[i]}`)
            let lastBytesLoaded = 0
            return bypassInterceptorAxios.put(createUploadRes.urls[i], chunk, {
              onUploadProgress: e => {
                const deltaUploaded = e.loaded - lastBytesLoaded
                // console.log(e.loaded, deltaUploaded, lastBytesLoaded)
                setBytesUploaded(prev => (prev += deltaUploaded))
                lastBytesLoaded = e.loaded
              },
            })
          })
        )

        setStatus('Completing upload')
        await axios({
          method: 'PATCH',
          url: `${getAPIUrl()}/videos/${videoId}/upload`,
          data: { key: createUploadRes.key, uploadId: createUploadRes.uploadId },
        })

        setStatus('Completed')
      } catch (error) {
        console.error('Error', error)
        setStatus('Errored')
      }
    }

    console.info('useEffect has loaded')
    if (status === 'waiting') {
      uploadVideo()
    }
  }, [])

  useEffect(() => {
    if (status === 'Completed') {
      console.log('Completed and calling delete')
      deleteItem()
    }
  }, [status, deleteItem])

  return (
    <Flex direction='column' w='100%'>
      <Flex mb='1' justify='space-between'>
        <Text isTruncated>{file.name}</Text>
      </Flex>
      <Progress
        size='xs'
        hasStripe
        isAnimated
        rounded='md'
        colorScheme='blue'
        value={(bytesUploaded / file.size) * 100}
      />
    </Flex>
  )
}
