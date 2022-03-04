import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import GoogleLogin from 'react-google-login'
import { IoLogoGoogle } from 'react-icons/io5'

import { UserContext } from '../contexts/user'
import axios from '../utils/axios'

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

export default function Login() {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState('')
  const { authenticated, login } = useContext(UserContext)

  async function handleLoginGoogle(response: any) {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
        token: response.tokenId,
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
          <Flex mb='4' justify='center'>
            <Heading size='lg'>Hello there!</Heading>
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
                <Button
                  my='1'
                  onClick={onClick}
                  isDisabled={disabled}
                  leftIcon={<IoLogoGoogle size='20px' />}
                >
                  Log in with Google
                </Button>
              )
            }}
          />
          <Flex fontSize='.8rem' w='100%' justify='center' p='2'>
            <Link href='/register'>Or register a new account</Link>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}
