import { useCallback, useContext } from 'react'
import { useDropzone } from 'react-dropzone'
import { Center, Button } from '@chakra-ui/react'
import { IoCloudUploadOutline } from 'react-icons/io5'
import { UploadsContext } from '../contexts/uploads'

const acceptedContentTypes = ['.jpg', '.png', '.gif', '.mp4']

export default function Upload() {
  const { addUpload } = useContext(UploadsContext)

  const onDrop = useCallback(acceptedFiles => {
    console.log('acceptedFiles', acceptedFiles)
    acceptedFiles.map((f: File) => addUpload(f))
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: acceptedContentTypes.join(', '),
  })

  return (
    <Center w='100%' {...getRootProps()}>
      <input {...getInputProps()} />
      <Button
        w='100%'
        size='lg'
        variant='ghost'
        justifyContent='flex-start'
        leftIcon={<IoCloudUploadOutline size='25px' />}
      >
        Upload
      </Button>
    </Center>
  )
}
