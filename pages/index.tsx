import Home from '../components/Home'
import Upload from '../components/Upload'
import Layout from '../components/Layout'
import { Flex } from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export default function HomePage() {
  const [file, setFile] = useState(null)

  const onDrop = useCallback(acceptedFiles => {
    console.log({ acceptedFiles })

    if (acceptedFiles.length) {
      setFile(acceptedFiles[0])
    }
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  if (file) {
    return (
      <Layout>
        <Upload file={file} />
      </Layout>
    )
  }

  return (
    <Layout>
      <Flex {...getRootProps()} border='solid red 1px'>
        <input {...getInputProps()} />
        <Home />
      </Flex>
    </Layout>
  )
}
