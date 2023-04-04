import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../contexts/UserContext'
import { Button, Flex, Heading, Input, VStack, useToast } from '@chakra-ui/react'

export default function LoginPage() {
  const toast = useToast()
  const router = useRouter()
  const { loading, login } = useUser()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin() {
    try {
      await login({ email, password })
      console.log('logged in')
      router.push('/')
    } catch (error) {
      toast({
        title: 'Login Error',
        description: 'Encountered an error while logging in.',
        status: 'error',
        duration: 4000,
        isClosable: false,
      })
    }
  }

  return (
    <Flex w='100vw' h='100vh' align='start' justify='center'>
      <Flex w='300px' mt='5rem' direction='column'>
        <Heading mb='20px'>Log In</Heading>
        <VStack spacing='2'>
          <Input
            variant='solid'
            placeholder='Email'
            value={email}
            onChange={e => {
              setEmail(e.target.value)
            }}
          />
          <Input
            type='password'
            variant='solid'
            placeholder='Password'
            onChange={e => {
              setPassword(e.target.value)
            }}
          />
        </VStack>
        <Button isLoading={loading} mt='20px' w='100%' onClick={handleLogin}>
          Log In
        </Button>
      </Flex>
    </Flex>
  )
}
