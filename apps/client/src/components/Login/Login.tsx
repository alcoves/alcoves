import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'

export default function Login() {
  const navigation = useNavigate()
  const { login } = useUser()

  async function handleLogin() {
    await login('changeme')
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
          <Input variant="filled" placeholder="Token" />
          <Button mt="2" w="100%" colorScheme="teal" onClick={handleLogin}>
            Submit
          </Button>
        </VStack>
      </Box>
    </Flex>
  )
}
