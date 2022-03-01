import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
import { Box, Button } from '@chakra-ui/react'

export default function Library() {
  const router = useRouter()

  return (
    <Layout>
      <Button
        size='sm'
        onClick={() => {
          router.push('/upload')
        }}
      >
        Upload
      </Button>
      <Box>Library Page</Box>
    </Layout>
  )
}
