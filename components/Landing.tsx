import { Button, Flex, Heading, HStack, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function Landing() {
  const router = useRouter()

  return (
    <Flex w='100vw' h='100%' direction='column'>
      <Flex w='100%' h='50px' align='center' justify='space-between'>
        <Flex align='center'>
          <Flex
            pl='1'
            cursor='pointer'
            align='center'
            onClick={() => {
              router.push('/')
            }}
          >
            <Image src='/logo.png' width='40px' height='40px' alt='logo' />
            <Text fontSize='1rem' pl='2'>
              bken.io
            </Text>
          </Flex>
        </Flex>
        <HStack pr='1'>
          <Button
            size='sm'
            onClick={() => {
              router.push('/login')
            }}
          >
            Log in
          </Button>
          <Button
            size='sm'
            onClick={() => {
              router.push('/register')
            }}
          >
            Register
          </Button>
        </HStack>
      </Flex>
      <Flex mt='4' justify='center' align='center' direction='column'>
        <Heading size='2xl'> For moments that matter </Heading>
        <Text fontSize='1rem'>bken is a place to save and share videos </Text>
      </Flex>
    </Flex>
  )
}
