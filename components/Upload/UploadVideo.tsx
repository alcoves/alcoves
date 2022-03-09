import { Flex, IconButton, Progress, Text } from '@chakra-ui/react'
import axios from 'axios'
import { useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
import { useRecoilState } from 'recoil'
import { useSWRConfig } from 'swr'

import { useWarnIfUploading } from '../../hooks/useWarnIfUploading'
import { recoilUploads } from '../../recoil/store'
import { Upload } from '../../types/types'
import chunkFile from '../../utils/chunkFile'
import { getAPIUrl } from '../../utils/urls'

const bypassInterceptorAxios = axios.create()

export default function UploadVideo({ upload }: { upload: Upload }) {
  const { mutate } = useSWRConfig()
  const [uploads, setUploads] = useRecoilState(recoilUploads)
  const index = uploads.findIndex(u => u.id === upload.id)

  useWarnIfUploading(upload.loading, () => {
    return confirm('Warning! You still have videos uploading!')
  })

  console.log('Upload useEffect', upload.id, index, uploads)

  useEffect(() => {
    function removeItemAtIndex(arr: Upload[], index: number) {
      return [...arr.slice(0, index), ...arr.slice(index + 1)]
    }

    function replaceItemAtIndex(arr: Upload[], index: number, newValue: any) {
      return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)]
    }

    const startUpload = () => {
      console.log('Start upload')
      const newUploads = replaceItemAtIndex(uploads, index, {
        ...upload,
        started: true,
        loading: true,
        bytesUploaded: 0,
      })
      setUploads(newUploads)
    }

    const completeUpload = () => {
      console.log('Complete upload')
      const newUploads = replaceItemAtIndex(uploads, index, {
        ...upload,
        started: true,
        loading: false,
        bytesUploaded: upload.file.size,
      })
      setUploads(newUploads)
    }

    const updateBytesUploaded = (value: number) => {
      console.log('Update bytes uploaded')
      const newUploads = replaceItemAtIndex(uploads, index, {
        ...upload,
        started: true,
        bytesUploaded: value,
      })
      setUploads(newUploads)
    }

    const removeUploadFromState = () => {
      console.log('Remove', index)
      const newUploads = removeItemAtIndex(uploads, index)
      console.log('newUploads', newUploads)
      // setUploads(newUploads)
      mutate(`${getAPIUrl()}/videos`)
    }

    async function uploadVideo() {
      try {
        startUpload()

        const chunks = chunkFile(upload.file)
        console.log('Creating video record')
        const createRes = await axios({
          method: 'POST',
          data: { title: upload.file.name },
          url: `${getAPIUrl()}/videos`,
        })

        const videoId = createRes.data?.payload?.id
        console.log('Creating video upload', { videoId })
        const createVudeoUploadRes = await axios({
          method: 'POST',
          data: { type: upload.file.type, chunks: chunks.length },
          url: `${getAPIUrl()}/videos/${videoId}/upload`,
        })

        const createUploadRes = createVudeoUploadRes.data?.payload?.upload
        console.log('Uploading Chunks', { createUploadRes })
        await Promise.all(
          chunks.map((chunk, i) => {
            console.log(`uploading part ${i} to ${createUploadRes.urls[i]}`)
            // let lastBytesLoaded = 0
            return bypassInterceptorAxios.put(createUploadRes.urls[i], chunk, {
              onUploadProgress: e => {
                // const deltaUploaded = e.loaded - lastBytesLoaded
                // console.log(e.loaded, deltaUploaded, lastBytesLoaded)
                // console.log(e.loaded, e.total)
                updateBytesUploaded(e.loaded)
                // lastBytesLoaded = e.loaded
              },
            })
          })
        )

        console.log('Completing video upload')
        await axios({
          method: 'PATCH',
          url: `${getAPIUrl()}/videos/${videoId}/upload`,
          data: { key: createUploadRes.key, uploadId: createUploadRes.uploadId },
        })
        completeUpload()
      } catch (error) {
        console.error('Error', error)
      } finally {
        removeUploadFromState()
      }
    }

    if (!upload.started) {
      uploadVideo()
    }
  }, [])

  return (
    <Flex direction='column' w='100%'>
      <Flex mb='1' justify='space-between'>
        <Text isTruncated>{upload.file.name}</Text>
        <IconButton
          size='xs'
          isDisabled
          variant='ghost'
          aria-label='close'
          icon={<IoClose size='16px' />}
        />
      </Flex>
      <Progress
        size='xs'
        hasStripe
        isAnimated
        rounded='md'
        colorScheme='blue'
        value={(upload.bytesUploaded / upload.file.size) * 100}
      />
    </Flex>
  )
}
