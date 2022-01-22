import { GoogleLogin } from 'react-google-login'

import Link from 'next/link'
import axios from '../utils/axios'
import { useRouter } from 'next/router'
import { UserContext } from '../contexts/user'
import React, { useContext, useState } from 'react'
import { Text, Box, Flex, Input, Heading, Button } from '@chakra-ui/react'

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

export default function Register() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const { authenticated, login } = useContext(UserContext)

  async function handleRegister() {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        email,
        username,
        password,
      })
      login(res.data.accessToken)
    } catch (error: any) {
      setErrorMsg(error.message)
    }
  }

  async function handleLoginGoogle(response: any) {
    try {
      if (response.tokenId) {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
          token: response.tokenId,
        })
        login(res.data.accessToken)
      }
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
          <GoogleLogin
            clientId={clientId}
            onSuccess={handleLoginGoogle}
            cookiePolicy={'single_host_origin'}
            onFailure={() => {
              setErrorMsg('There was an error')
            }}
            render={({ onClick, disabled }: any) => {
              return (
                <Button isDisabled={disabled} onClick={onClick} my='1'>
                  Register With Google
                </Button>
              )
            }}
          />
          <Box bgColor='gray.900' h='3px' w='100%' my='1' borderRadius='4' mt='4' />
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
