import { Box, Flex, Heading } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  return (
    <Flex w='100%'>
      <Flex direction='column' justify='center'>
        <Box
          cursor='pointer'
          onClick={() => router.push('/events/russian-ukrainian-war')}
          bg='black'
          w='500px'
          width='100%'
          rounded='md'
          backgroundImage='https://cdn.bken.io/events/ukraine/header-1.jpg'
        >
          <Heading p='2'> Russian-Ukranian Conflict </Heading>
        </Box>
      </Flex>
    </Flex>
  )
}
