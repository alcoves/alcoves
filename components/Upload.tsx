import { useRouter } from 'next/router'
import { useDropzone } from 'react-dropzone'
import { Box, Button } from '@chakra-ui/react'
import { useCallback, useContext } from 'react'
import { IoCloudUpload } from 'react-icons/io5'
import { UploadsContext } from '../contexts/uploads'

const acceptedContentTypes = ['.jpg', '.png', '.gif', '.mp4']

export default function Upload({ expanded }: { expanded: boolean }) {
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
    <Box {...getRootProps()} w='100%'>
      <input {...getInputProps()} />
      <Button w='100%' aria-label='upload' leftIcon={<IoCloudUpload size='20px' />}>
        {expanded ? 'Upload' : ''}
      </Button>
    </Box>
  )
}
