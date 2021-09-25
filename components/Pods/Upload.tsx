import axios from 'axios'
import { Box, Progress } from '@chakra-ui/react'
import { useDropzone } from 'react-dropzone'
import { getApiUrl } from '../../utils/api'
import { fetchMutate } from '../../utils/fetcher'
import { useCallback, useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'

export function Upload(props: { podId: string }): JSX.Element {
  const { mutate } = useSWRConfig()
  const { podId } = props
  const [progress, setProgress] = useState(0)
  const [upload, setUpload] = useState<File | null>(null)
  const onDrop = useCallback(acceptedFiles => {
    console.log(acceptedFiles)
    setUpload(acceptedFiles[0])
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  async function uploadFile(file: File) {
    try {
      console.log('Begin Video Upload', file)
      // Create video returns a url to begin the upload
      const { data } = await fetchMutate({
        method: 'get',
        url: `${getApiUrl()}/pods/${podId}/videos/upload`,
      })

      // Upload file
      console.log('Signed URL fetched', data)
      await axios.put(data.url, upload, {
        onUploadProgress: e => {
          setProgress((e.loaded / e.total) * 100)
        },
      }) // Uploads to s3
      console.log('Upload to S3 complete')
      await fetchMutate({
        method: 'post',
        data: { title: file.name },
        url: `${getApiUrl()}/pods/${podId}/videos/${data._id}`,
      }) // Enqueues jobs
      console.log('Jobs successfully enqueued')
    } catch (error) {
      console.error(error)
    } finally {
      mutate(`${getApiUrl()}/pods`)
      setProgress(0)
      setUpload(null)
    }
  }

  useEffect(() => {
    if (upload) uploadFile(upload)
  }, [upload])

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
        <input {...getInputProps()} disabled={Boolean(progress)} />
        {progress ? (
          <Progress value={progress} w='200px' colorScheme='green' size='xs' />
        ) : (
          'Upload Here'
        )}
      </Box>
    </>
  )
}
