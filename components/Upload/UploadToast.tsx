import { Flex, Heading, VStack } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil'

import { useWarnIfUploading } from '../../hooks/useWarnIfUploading'
import { recoilUploads } from '../../recoil/store'

import UploadVideo from './UploadVideo'

export default function UploadToast() {
  const uploads = useRecoilValue(recoilUploads)

  useWarnIfUploading(uploads.length === 0, () => {
    return confirm('Warning! You still have videos uploading!')
  })

  if (uploads?.length) {
    return (
      <Flex
        p='4'
        m='4'
        w='300px'
        right='0'
        bottom='0'
        rounded='md'
        bg='gray.700'
        zIndex={1000}
        position='fixed'
        direction='column'
      >
        <Flex justify='space-between' align='end' mb='2'>
          <Heading size='md'>Uploading</Heading>
        </Flex>
        <VStack spacing={1} align='start' maxH='70vh' overflowY='auto'>
          {uploads.map(upload => {
            return <UploadVideo key={upload.id} id={upload.id} file={upload.file} />
          })}
        </VStack>
      </Flex>
    )
  }

  return null
}
