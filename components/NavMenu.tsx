import UsageQuota from './UsageQuota'
import { useRouter } from 'next/router'
import { Button, Flex, VStack } from '@chakra-ui/react'

export default function NavMenu() {
  const router = useRouter()

  return (
    <Flex w='100%' direction='column'>
      <VStack p='1' spacing='1'>
        <Button onClick={() => router.push('/')} w='100%' size='sm' variant='ghost'>
          Library
        </Button>
        <Button onClick={() => router.push('/pods')} w='100%' size='sm' variant='ghost'>
          Pods
        </Button>
        <Button isDisabled={true} w='100%' size='sm' variant='ghost'>
          Settings
        </Button>
        <Button isDisabled={true} w='100%' size='sm' variant='ghost'>
          Feedback
        </Button>
        <Button isDisabled={true} w='100%' size='sm' variant='ghost'>
          Help
        </Button>
        <Button isDisabled={true} w='100%' size='sm' variant='ghost'>
          Links
        </Button>
        <UsageQuota />
      </VStack>
    </Flex>
  )
}
