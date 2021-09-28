import axios from 'axios'
import chunkFile from '../../utils/chunkFile'
import { useSWRConfig } from 'swr'
import { getApiUrl } from '../../utils/api'
import { useDropzone } from 'react-dropzone'
import { fetchMutate } from '../../utils/fetcher'
import { useCallback, useEffect, useState } from 'react'
import { Text, Box, Progress, useColorModeValue } from '@chakra-ui/react'

interface MultipartResponse {
  ETag: string
  PartNumber: number
}

function RenderUpload(props: { file: File; podId: string }) {
  const { mutate } = useSWRConfig()
  const { file, podId } = props
  const [status, setStatus] = useState('starting')
  const [bytesUploaded, setBytesUploaded] = useState(0)
  const percentCompleted = (bytesUploaded / file.size) * 100

  async function startUpload() {
    try {
      setBytesUploaded(0)
      setStatus('uploading')
      console.log('Begin Video Upload', file)
      const chunks = chunkFile(file)

      const {
        data: { uploadId, key, _id, urls },
      } = await fetchMutate({
        method: 'post',
        url: `${getApiUrl()}/pods/${podId}/videos/upload`,
        data: { chunks: chunks.length },
      })

      const results = await Promise.all(
        chunks.map((chunk, i) => {
          console.log(`uploading part ${i} to ${urls[i]}`)
          let lastBytesLoaded = 0
          return axios.put(urls[i], chunk, {
            onUploadProgress: e => {
              const deltaUploaded = e.loaded - lastBytesLoaded
              setBytesUploaded(p => p + deltaUploaded)
              lastBytesLoaded = e.loaded
            },
          })
        })
      )

      const parts: MultipartResponse[] = []
      results.forEach(({ headers }, i) => {
        parts.push({ ETag: headers.etag, PartNumber: i + 1 })
      })

      console.log('Multipart Upload Complete')
      setStatus('finishing')
      await fetchMutate({
        method: 'post',
        data: {
          key,
          parts,
          uploadId,
          title: file.name,
        },
        url: `${getApiUrl()}/pods/${podId}/videos/${_id}`,
      })
      setStatus('completed')
    } catch (error) {
      setStatus('error')
      console.error(error)
    } finally {
      mutate(`${getApiUrl()}/pods/${podId}/videos/`)
    }
  }

  useEffect(() => {
    startUpload()
  }, [])

  return (
    <Box py='2' w='200px'>
      <Text fontSize='xs' isTruncated>
        {file.name}
      </Text>
      <Progress
        hasStripe
        size='xs'
        value={percentCompleted}
        isAnimated={status === 'uploading'}
        colorScheme={status === 'error' ? 'red' : 'green'}
      />
      <Text fontSize='xs' isTruncated>
        {percentCompleted.toFixed(2)}
      </Text>
    </Box>
  )
}

export function Upload(props: { podId: string }): JSX.Element {
  const { podId } = props
  const [uploads, setUploads] = useState<File[] | []>([])

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.map((f: File) => setUploads((p: File[]) => [...p, f]))
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <>
      <Box
        {...getRootProps()}
        p='20px'
        w='100%'
        rounded='md'
        border='dashed'
        cursor='pointer'
        borderWidth='1px'
        borderStyle='dashed'
        color={useColorModeValue('gray.600', 'gray.200')}
      >
        <input {...getInputProps()} multiple />
        {'Upload Here'}
      </Box>
      {uploads?.map((file: File, index) => {
        return <RenderUpload key={index} file={file} podId={podId} />
      })}
    </>
  )
}
