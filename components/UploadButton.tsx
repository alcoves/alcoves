import { useCallback } from 'react'
import { Button } from '@chakra-ui/react'
import { useDropzone } from 'react-dropzone'
import { IoCloudUpload } from 'react-icons/io5'

export default function UploadButton() {
  function onFileAccepted(file: any) {
    console.log('file accepted')
  }

  const onDrop = useCallback(
    acceptedFiles => {
      onFileAccepted(acceptedFiles[0])
    },
    [onFileAccepted]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov'],
    },
    maxFiles: 1,
    multiple: false,
  })

  return (
    <Button leftIcon={<IoCloudUpload />} size='xs' mr='4' {...getRootProps()}>
      <input {...getInputProps()} />
      Upload
    </Button>
  )
}
