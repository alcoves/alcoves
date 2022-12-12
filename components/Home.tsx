import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Flex, Heading } from '@chakra-ui/react'

export default function Home() {
  const onDrop = useCallback(acceptedFiles => {
    console.log({ acceptedFiles })

    if (acceptedFiles.length) {
      // start upload acceptedFiles[0];
    }
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <Flex {...getRootProps()} p='4' align='start' justify='center' border='solid red 2px'>
      <input {...getInputProps()} />
      {isDragActive ? (
        <Flex>Drop here</Flex>
      ) : (
        <Flex direction='column' pt='10'>
          <Heading>Drag file here or</Heading>
          <Heading>click anywhere to upload</Heading>
        </Flex>
      )}
    </Flex>
  )
}
