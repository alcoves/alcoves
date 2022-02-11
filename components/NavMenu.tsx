import UsageQuota from './UsageQuota'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { Box, Button, Flex, VStack } from '@chakra-ui/react'
import { IoBookOutline, IoPeopleOutline } from 'react-icons/io5'

function NavButton({ text, icon, path }: { text: string; icon: ReactElement; path: string }) {
  const router = useRouter()
  const variant = router.pathname === path ? 'solid' : 'ghost'

  return (
    <Button
      w='100%'
      size='md'
      leftIcon={icon}
      colorScheme='teal'
      variant={variant}
      justifyContent='start'
      onClick={() => router.push(path)}
    >
      {text}
    </Button>
  )
}

export default function NavMenu() {
  return (
    <Flex p='1' w='100%' h='100%' direction='column' justify='space-between'>
      <VStack spacing='1'>
        <NavButton text='Library' icon={<IoBookOutline size='20px' />} path='/' />
        <NavButton text='Pods' icon={<IoPeopleOutline size='20px' />} path='/pods' />
      </VStack>
      <Flex direction='column' mb='4'>
        <Box p='2'>
          <UsageQuota />
        </Box>
        <Flex w='100%' justify='space-evenly'>
          <Box fontSize='.75rem'> Terms </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}
