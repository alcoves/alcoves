import { IoFilm } from 'react-icons/io5'
import { useRouter } from 'next/navigation'
import { Button, Flex, VStack } from '@chakra-ui/react'

export default function SideBar() {
  const router = useRouter()

  function handleClick(e, href) {
    e.preventDefault()
    router.push(href)
  }

  return (
    <Flex bg="gray.900" h="100%" w="52">
      <VStack spacing={2} w="100%" align="start" p="2">
        <Button
          w="100%"
          size="md"
          justifyContent="start"
          leftIcon={<IoFilm />}
          onClick={(e) => handleClick(e, '/assets')}
        >
          Alcove
        </Button>
      </VStack>
    </Flex>
  )
}
