import UploadVideo from './UploadVideo'
import { useDropzone } from 'react-dropzone'
import { useCallback, useState } from 'react'
import { Box, Flex, Heading, Input, useColorMode, VStack } from '@chakra-ui/react'

export default function Upload() {
  const { colorMode } = useColorMode()
  const [files, setFiles] = useState([]) as any
  const onDrop = useCallback(acceptedFiles => {
    setFiles((prev: any) => [...prev, ...acceptedFiles])
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop })
  const borderColor = colorMode === 'dark' ? 'gray.700' : 'gray.100'

  return (
    <Flex direction='column' align='center'>
      <Box w='600px'>
        <Flex
          {...getRootProps()}
          p='4'
          h='200px'
          align='center'
          justify='center'
          borderWidth='2px'
          borderStyle='dashed'
          borderColor={borderColor}
        >
          <input {...getInputProps()} />
          <Heading size='md'> Drop here or select to upload </Heading>
        </Flex>
        <Input my='2' placeholder='Import video from URL' />
        {files.length ? (
          <VStack direction='column' mt='4'>
            <Heading size='md'> Uploading Queue </Heading>
            {files.map((f: any, i: number) => (
              <UploadVideo key={i} file={f} />
            ))}
          </VStack>
        ) : null}
      </Box>
    </Flex>
  )
}
