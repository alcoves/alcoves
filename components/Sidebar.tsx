import Footer from './Footer'
import CreatePod from './Pods/CreatePod'
import PodsList from './Sidebar/PodsList'
import { useRouter } from 'next/router'
import { Button, Flex, VStack } from '@chakra-ui/react'
import { IoRadioOutline } from 'react-icons/io5'

export default function Sidebar() {
  const { pathname, push } = useRouter()
  return (
    <Flex p='2' h='100%' w='220px' direction='column' justify='space-between'>
      <VStack spacing='4'>
        <Button
          w='100%'
          size='md'
          onClick={() => push('/')}
          justifyContent='flex-start'
          leftIcon={<IoRadioOutline size='22px' />}
          variant={pathname === '/' ? 'solid' : 'ghost'}
        >
          Home
        </Button>
        <PodsList />
        <CreatePod />
      </VStack>
      <Footer />
    </Flex>
  )
}
