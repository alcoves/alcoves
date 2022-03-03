import Card from '../../../components/Card'
import Layout from '../../../components/Layout'
import useLazyRequest from '../../../hooks/useLazyRequest'
import { useRouter } from 'next/router'
import { useDropzone } from 'react-dropzone'
import { getAPIUrl } from '../../../utils/urls'
import { useCallback, useEffect, useState } from 'react'
import { Box, Flex, Heading, Input, Progress, Text, useColorMode, VStack } from '@chakra-ui/react'

function UploadItem({ file, podId }: { file: any; podId: string | string[] | undefined }) {
  const [progress, setProgress] = useState(0)
  const [createVideoRequest, { data, error, loading }] = useLazyRequest()

  async function createVideo() {
    if (podId) {
      await createVideoRequest({
        method: 'POST',
        data: { title: file.name },
        url: `${getAPIUrl()}/pods/${podId}/videos`,
      })
      setProgress(100)
    }
  }

  useEffect(() => {
    console.log('library item mounted', file)

    // Create item in api
    // Get presigned post request url
    // Start file upload

    createVideo()
  }, [])

  console.log({ data, error, loading })

  return (
    <Card>
      <Flex w='100%' direction='column' p='2'>
        <Flex>
          <Text fontWeight={600}>{file.name}</Text>
        </Flex>
        <Progress bg='transparent' value={progress} mt='1' w='100%' colorScheme='teal' h='2px' />
      </Flex>
    </Card>
  )
}

export default function PodUpload() {
  const router = useRouter()
  const { colorMode } = useColorMode()
  const [files, setFiles] = useState([]) as any
  const onDrop = useCallback(acceptedFiles => {
    setFiles((prev: any) => [...prev, ...acceptedFiles])
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop })
  const borderColor = colorMode === 'dark' ? 'gray.700' : 'gray.100'

  return (
    <Layout>
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
                <UploadItem key={i} file={f} podId={router.query.podId} />
              ))}
            </VStack>
          ) : null}
        </Box>
      </Flex>
    </Layout>
  )
}
