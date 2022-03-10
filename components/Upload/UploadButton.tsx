import { Box, Button, Flex } from '@chakra-ui/react'
import { nanoid } from 'nanoid'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { IoCloudUpload } from 'react-icons/io5'
import { useSetRecoilState } from 'recoil'

import { recoilUploads } from '../../recoil/store'
import { Upload } from '../../types/types'

export default function UploadButton() {
  const setUploads = useSetRecoilState(recoilUploads)
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newUploads: Upload[] = acceptedFiles.map((f: File) => {
        return {
          file: f,
          id: nanoid(),
        }
      })

      setUploads(prev => [...prev, ...newUploads])
    },
    [setUploads]
  )
  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <>
      <Flex direction='column' align='center'>
        <Box w='100%'>
          <Flex w='120px' {...getRootProps()} align='center' justify='start' py='1'>
            <input {...getInputProps()} />
            <Button size='sm' w='100%' leftIcon={<IoCloudUpload size='18px' />}>
              Upload
            </Button>
          </Flex>
        </Box>
      </Flex>
    </>
  )
}
