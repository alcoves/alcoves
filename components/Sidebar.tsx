import Footer from './Footer'
import CreatePod from './Pods/CreatePod'
import { useRouter } from 'next/router'
import { IoRadioOutline } from 'react-icons/io5'
import { Button, Flex, Heading, VStack } from '@chakra-ui/react'
import PodsList from './Sidebar/PodsList'

export default function Sidebar() {
  const { pathname } = useRouter()
  return (
    <Flex p='2' direction='column' justify='space-between' minH='100%' w='220px'>
      <VStack spacing='4px'>
        <Button
          w='100%'
          size='lg'
          justifyContent='flex-start'
          variant={pathname === '/' ? 'solid' : 'ghost'}
          leftIcon={<IoRadioOutline size='25px' />}
        >
          Home
        </Button>
        <Flex w='100%' align='center' justify='space-between'>
          <Heading
            w='100%'
            py='20px'
            size='xs'
            opacity='.3'
            letterSpacing='.1rem'
            textTransform='uppercase'
          >
            Pods
          </Heading>
          <CreatePod />
        </Flex>
        <PodsList />
      </VStack>
      <Footer />
    </Flex>
  )
}
