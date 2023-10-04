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

// TODO :: Add a warning if users already exist, this route can only be used once

export default function Setup() {
  const navigation = useNavigate()
  const { login } = useUser()

  async function handleLogin() {
    await login({ id: '1', username: 'test' }, 'token')
    navigation('/')
  }

  return (
    <Flex w="100vw" h="100vh" justify="center" align="start">
      <Box p="2" pt="8" w="400px">
        <VStack spacing={2}>
          <Heading size="md">Alcoves Setup</Heading>
          <Text align="center">
            Welcome to Alcoves! This setup will guide you through the process of
            creating your first user account.
          </Text>
          <Input variant="filled" placeholder="Username" />
          <Input variant="filled" placeholder="Password" />
          <Button mt="2" w="100%" colorScheme="teal" onClick={handleLogin}>
            Submit
          </Button>
        </VStack>
      </Box>
    </Flex>
  )
}
