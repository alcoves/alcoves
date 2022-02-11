import UsageQuota from './UsageQuota'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { IoBookOutline, IoPeopleOutline } from 'react-icons/io5'
import { Button, Flex, VStack } from '@chakra-ui/react'

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
    <Flex w='100%' direction='column'>
      <VStack p='1' spacing='1'>
        <NavButton text='Library' icon={<IoBookOutline size='20px' />} path='/' />
        <NavButton text='Pods' icon={<IoPeopleOutline size='20px' />} path='/pods' />
        <UsageQuota />
      </VStack>
    </Flex>
  )
}
