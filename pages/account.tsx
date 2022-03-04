import Layout from '../components/Layout'
import { Box, Button, useColorMode } from '@chakra-ui/react'
import { IoMoon, IoSunny } from 'react-icons/io5'

export default function Account() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Layout>
      <Box>Account page</Box>
      <Button
        size='sm'
        onClick={toggleColorMode}
        leftIcon={colorMode === 'dark' ? <IoMoon /> : <IoSunny />}
      >
        Theme
      </Button>
    </Layout>
  )
}
