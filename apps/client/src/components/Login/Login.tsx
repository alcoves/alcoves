import useSWR from 'swr'

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button } from '@chakra-ui/react'
import { useUser } from '../../contexts/UserContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useUser()
  const { data } = useSWR('/info')

  function handleLogin() {
    login({ id: '1', username: 'test' }, 'token')
  }

  useEffect(() => {
    if (!data?.isSetup) {
      navigate('/setup')
    }
  }, [data])

  return (
    <Box>
      <div>Login</div>
      <Button onClick={handleLogin}>Login</Button>
    </Box>
  )
}
