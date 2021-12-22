import { useDropzone } from 'react-dropzone'
import { Box, Button, IconButton, Spinner } from '@chakra-ui/react'
import { useCallback, useContext } from 'react'
import { IoCloudUpload } from 'react-icons/io5'
import { UploadsContext } from '../contexts/uploads'

const acceptedContentTypes = ['.mp4']

export default function UploadButton({ expanded }: { expanded: boolean }) {
  const { uploads, addUpload } = useContext(UploadsContext)

  const inProgressUpload = Object.values(uploads).filter(u => u.file.size !== u.completed)

  const onDrop = useCallback(acceptedFiles => {
    console.log('Accepted Files', acceptedFiles)
    acceptedFiles.map((f: File) => addUpload(f))
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
      {expanded ? (
        <Button
          w='100%'
          aria-label='upload'
          leftIcon={<IoCloudUpload size='20px' />}
          rightIcon={Boolean(inProgressUpload.length) ? <Spinner size='xs' /> : <></>}
        >
          Upload
        </Button>
      ) : (
        <IconButton w='100%' aria-label='upload' icon={<IoCloudUpload size='20px' />} />
      )}
    </Box>
  )
}
