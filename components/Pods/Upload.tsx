import axios from 'axios'
import chunkFile from '../../utils/chunkFile'
import { useSWRConfig } from 'swr'
import { getApiUrl } from '../../utils/api'
import { useDropzone } from 'react-dropzone'
import { fetchMutate } from '../../utils/fetcher'
import { Text, Box, Progress } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'

interface MultipartResponse {
  ETag: string
  PartNumber: number
}

function RenderUpload(props: { file: File; podId: string }) {
  const { mutate } = useSWRConfig()
  const { file, podId } = props
  const [started, setStarted] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [bytesUploaded, setBytesUploaded] = useState(0)

  async function startUpload() {
    try {
      setStarted(true)
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
          return axios.put(urls[i], chunk, {
            onUploadProgress: e => {
              setBytesUploaded(p => p + e.loaded)
            },
          })
        })
      )

      const parts: MultipartResponse[] = []
      results.forEach(({ headers }, i) => {
        parts.push({ ETag: headers.etag, PartNumber: i + 1 })
      })

      console.log('Multipart Upload Complete')
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
    } catch (error) {
      console.error(error)
    } finally {
      mutate(`getApiUrl()}/pods/${podId}/videos/`)
      setBytesUploaded(0)
      setCompleted(true)
    }
  }

  useEffect(() => {
    if (file && !started) {
      startUpload()
    }
  }, [file, podId, started])

  if (bytesUploaded || completed || !started) {
    return (
      <Box py='2' w='200px'>
        <Text fontSize='xs' isTruncated>
          {file.name}
        </Text>
        <Progress
          hasStripe
          size='xs'
          isAnimated
          colorScheme='green'
          value={(bytesUploaded / file.size) * 100}
        />
      </Box>
    )
  }

  return null
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
        border='dashed'
        borderWidth='2px'
        borderStyle='dashed'
        rounded='md'
        cursor='pointer'
        p='4px 10px 4px 10px'
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
