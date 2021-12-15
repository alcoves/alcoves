import { useRouter } from 'next/router'
import { useDropzone } from 'react-dropzone'
import { Button, Box } from '@chakra-ui/react'
import { useCallback, useContext } from 'react'
import { UploadsContext } from '../contexts/uploads'
import { IoCloudUploadOutline } from 'react-icons/io5'

const acceptedContentTypes = ['.jpg', '.png', '.gif', '.mp4']

export default function Upload() {
  const router = useRouter()
  const podId = router.query.podId
  const { addUpload } = useContext(UploadsContext)

  const onDrop = useCallback(acceptedFiles => {
    console.log('acceptedFiles', acceptedFiles)
    if (podId) {
      acceptedFiles.map((f: File) => addUpload(f, podId))
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 50,
    multiple: true,
    accept: acceptedContentTypes.join(', '),
  })

  return (
    <Box {...getRootProps()}>
      <input {...getInputProps()} />
      <Button justifyContent='flex-start' leftIcon={<IoCloudUploadOutline size='25px' />}>
        Upload
      </Button>
    </Box>
  )
}
