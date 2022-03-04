import UploadVideo from './UploadVideo'
import { Box, Button, Flex, Heading, VStack } from '@chakra-ui/react'
import { IoCloudUpload } from 'react-icons/io5'
import { getAPIUrl } from '../../utils/urls'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useSWRConfig } from 'swr'

export default function Upload() {
  const { mutate } = useSWRConfig()
  const [files, setFiles] = useState([]) as any
  const onDrop = useCallback(acceptedFiles => {
    setFiles((prev: any) => [...prev, ...acceptedFiles])
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  function removeFromList(index: number) {
    if (index > -1) {
      const newArray = files
      newArray.splice(index, 1)
      setFiles(newArray)
      mutate(`${getAPIUrl()}/videos`)
    }
  }

  return (
    <>
      <Flex direction='column' align='center'>
        <Box w='100%'>
          <Flex w='120px' {...getRootProps()} align='center' justify='start' py='1'>
            <input {...getInputProps()} />
            <Button w='100%' leftIcon={<IoCloudUpload size='24px' />}>
              Upload
            </Button>
          </Flex>
          {files.length ? (
            <VStack direction='column' mt='4'>
              <Heading size='md'> Uploading Queue </Heading>
              {files.map((f: any, i: number) => (
                <UploadVideo
                  key={i}
                  file={f}
                  removeFromList={() => {
                    removeFromList(i)
                  }}
                />
              ))}
            </VStack>
          ) : null}
        </Box>
      </Flex>
    </>
  )
}
