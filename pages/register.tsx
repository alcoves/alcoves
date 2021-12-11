import axios from 'axios'
import useUser from '../hooks/useUser'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Text, Box, Flex, Input, Heading, Button } from '@chakra-ui/react'
import Link from 'next/link'

export default function Register() {
  const router = useRouter()
  const { authenticated, login } = useUser()
  const [email, setEmail] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  async function handleRegister() {
    try {
      const res = await axios.post('http://localhost:4000/register', {
        email,
        username,
        password,
      })
      login(res.data.accessToken)
    } catch (error: any) {
      setErrorMsg(error.message)
    }
  }

  if (authenticated) {
    router.push('/')
    return null
  }

  return (
    <Box>
      <Flex justify='center' align='top'>
        <Flex w='300px' mt='100px' direction='column'>
          <Flex justify='center'>
            <Heading size='lg'>Create an Account</Heading>
          </Flex>
          <Flex justify='center'>
            <Text color='brand.red'>{errorMsg}</Text>
          </Flex>
          <Input
            mt='4'
            type='email'
            variant='filled'
            placeholder='email'
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            mt='4'
            type='username'
            variant='filled'
            placeholder='username'
            onChange={e => setUsername(e.target.value)}
          />
          <Input
            mt='4'
            type='password'
            variant='filled'
            placeholder='password'
            onKeyPress={e => {
              if (e.key === 'Enter') {
                handleRegister()
              }
            }}
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            mt='4'
            _hover={{ bg: 'teal.500' }}
            onClick={() => {
              handleRegister()
            }}
          >
            Register
          </Button>
          <Flex fontSize='.8rem' w='100%' justify='center' p='2'>
            <Link href='/login'>Or login</Link>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}
