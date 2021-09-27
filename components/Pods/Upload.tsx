import axios from 'axios'
import { useSWRConfig } from 'swr'
import { getApiUrl } from '../../utils/api'
import { useDropzone } from 'react-dropzone'
import { fetchMutate } from '../../utils/fetcher'
import { Text, Box, Progress } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'

function RenderUpload(props: { file: File; podId: string }) {
  const { mutate } = useSWRConfig()
  const { file, podId } = props
  const [progress, setProgress] = useState(0)
  const [started, setStarted] = useState(false)

  async function startUpload() {
    try {
      setStarted(true)
      console.log('Begin Video Upload', file)

      const { data } = await fetchMutate({
        method: 'get',
        url: `${getApiUrl()}/pods/${podId}/videos/upload`,
      })

      console.log('Signed URL fetched', data)
      await axios.put(data.url, file, {
        onUploadProgress: e => {
          setProgress((e.loaded / e.total) * 100)
        },
      })

      console.log('Upload to S3 complete')
      await fetchMutate({
        method: 'post',
        data: { title: file.name },
        url: `${getApiUrl()}/pods/${podId}/videos/${data._id}`,
      })
    } catch (error) {
      console.error(error)
    } finally {
      mutate(`getApiUrl()}/pods/${podId}/videos/`)
      setProgress(0)
    }
  }

  useEffect(() => {
    if (file && !started) {
      startUpload()
    }
  }, [file, podId, started])

  if (progress) {
    return (
      <Box py='2' w='200px'>
        <Text fontSize='xs' isTruncated>
          {file.name}
        </Text>
        <Progress value={progress} colorScheme='green' size='xs' />
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
