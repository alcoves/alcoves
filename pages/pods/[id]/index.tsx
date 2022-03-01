import Layout from '../../../components/Layout'
import { useRouter } from 'next/router'
import { IoAdd } from 'react-icons/io5'
import { Box, Button } from '@chakra-ui/react'

export default function EventPage() {
  const router = useRouter()

  return (
    <Layout>
      <Button size='sm' onClick={() => router.push(`${router.asPath}/submit`)} leftIcon={<IoAdd />}>
        Add Media
      </Button>
      <Box> Display archive content </Box>
    </Layout>
  )
}
