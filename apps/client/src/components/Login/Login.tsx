import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react'

export default function Login() {
  const [token, setToken] = useState<string>('')
  const navigation = useNavigate()
  const { login } = useUser()

  async function handleLogin() {
    await login(token)
    navigation('/')
  }

  return (
    <Flex w="100vw" h="100vh" justify="center" align="start">
      <Box p="2" pt="8" w="400px">
        <VStack spacing={2}>
          <Heading size="md">Login</Heading>
          <Text align="center">
            Welcome! Enter your alcoves token to get started.
          </Text>
          <Input
            value={token}
            variant="filled"
            placeholder="Token"
            onChange={(e) => setToken(e.target.value)}
          />
          <Button mt="2" w="100%" colorScheme="teal" onClick={handleLogin}>
            Submit
          </Button>
        </VStack>
      </Box>
    </Flex>
  )
}
