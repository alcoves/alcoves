import { useRouter } from 'next/navigation'
import { Button, Flex, VStack } from '@chakra-ui/react'

export default function SideBar() {
  const router = useRouter()

  function handleClick(e, href) {
    e.preventDefault()
    router.push(href)
  }

  return (
    <Flex h='calc(100vh - 80px)' w='52' overflowY='scroll'>
      <VStack spacing={3} w='100%' align='start' p='2'>
        <Button onClick={e => handleClick(e, '/')}>Media</Button>
        <Button onClick={e => handleClick(e, '/')}>Media</Button>
        <Button onClick={e => handleClick(e, '/')}>Media</Button>
        <Button onClick={e => handleClick(e, '/')}>Media</Button>
        <Button onClick={e => handleClick(e, '/')}>Media</Button>
        <Button onClick={e => handleClick(e, '/')}>Media</Button>
        <Button onClick={e => handleClick(e, '/')}>Media</Button>
        <Button onClick={e => handleClick(e, '/')}>Media</Button>
      </VStack>
    </Flex>
  )
}
