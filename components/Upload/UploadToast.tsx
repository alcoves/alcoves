import { Flex, Heading, VStack } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil'

import { recoilUploads } from '../../recoil/store'

import UploadVideo from './UploadVideo'

export default function UploadToast() {
  const uploads = useRecoilValue(recoilUploads)
  console.log('upload toast', uploads)

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
            return <UploadVideo key={upload.id} upload={upload} />
          })}
        </VStack>
      </Flex>
    )
  }

  return null
}
