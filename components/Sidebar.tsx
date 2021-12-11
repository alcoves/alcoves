import Footer from './Footer'
import { useRouter } from 'next/router'
import { Button, Flex, Heading, VStack } from '@chakra-ui/react'
import { IoCloudUploadOutline, IoRadioOutline } from 'react-icons/io5'

export default function Sidebar() {
  const { pathname } = useRouter()
  return (
    <Flex p='2' direction='column' justify='space-between' minH='100%' w='220px'>
      <VStack spacing='4px'>
        <Button
          w='100%'
          size='lg'
          variant='ghost'
          justifyContent='flex-start'
          leftIcon={<IoCloudUploadOutline size='25px' />}
        >
          Upload
        </Button>
        <Button
          w='100%'
          size='lg'
          justifyContent='flex-start'
          variant={pathname === '/' ? 'solid' : 'ghost'}
          leftIcon={<IoRadioOutline size='25px' />}
        >
          My Bken
        </Button>
        <Heading
          w='100%'
          py='20px'
          size='xs'
          opacity='.3'
          letterSpacing='.1rem'
          textTransform='uppercase'
        >
          Compartments
        </Heading>
        <div>Shared bken here</div>
      </VStack>
      <Footer />
    </Flex>
  )
}
