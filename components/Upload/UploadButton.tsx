import { Button, Flex } from '@chakra-ui/react'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { IoCloudUpload } from 'react-icons/io5'

import { uploadsStore } from '../../stores/uploads'

const TEN_GB = 1000000000 * 10

export default function UploadButton() {
  const { add } = uploadsStore()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.map((file: File) => add(file))
    },
    [add]
  )
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 50,
    maxSize: TEN_GB,
    accept: 'video/*',
  })

  return (
    <>
      <Flex direction='column' align='end' justify='center'>
        <Flex w='120px' {...getRootProps()} align='center' justify='start' py='1'>
          <input {...getInputProps()} />
          <Button size='sm' w='100%' leftIcon={<IoCloudUpload size='18px' />}>
            Upload
          </Button>
        </Flex>
      </Flex>
    </>
  )
}
