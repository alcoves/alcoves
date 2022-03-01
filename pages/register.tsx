import Link from 'next/link'
import axios from '../utils/axios'
import { useRouter } from 'next/router'
import { UserContext } from '../contexts/user'
import { IoLogoGoogle } from 'react-icons/io5'
import { GoogleLogin } from 'react-google-login'
import React, { useContext, useState } from 'react'
import { Text, Box, Flex, Heading, Button } from '@chakra-ui/react'
import { getAPIUrl } from '../utils/urls'

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

export default function Register() {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState('')
  const { authenticated, login } = useContext(UserContext)

  async function handleLoginGoogle(response: any) {
    try {
      if (response.tokenId) {
        const res = await axios.post(`${getAPIUrl()}/auth/google`, {
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
          <Flex mb='4' justify='center'>
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
                <Button
                  my='1'
                  onClick={onClick}
                  isDisabled={disabled}
                  leftIcon={<IoLogoGoogle size='20px' />}
                >
                  Register with Google
                </Button>
              )
            }}
          />
          <Flex fontSize='.8rem' w='100%' justify='center' p='2'>
            <Link href='/login'>Or login</Link>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}
