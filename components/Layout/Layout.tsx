import Footer from './Footer'
import TopBar from './TopBar'
import SideBar from './SideBar'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Flex } from '@chakra-ui/react'
import { useUser } from '../../Contexts/UserContext'

export default function Layout({ children }) {
  const router = useRouter()
  const { user, loading } = useUser()

  useEffect(() => {
    if (!loading && !user?.isAuthenticated) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (!loading && user.isAuthenticated) {
    return (
      <Box>
        <TopBar />
        <Flex h='100%'>
          <SideBar />
          <Box w='100%' p='2' overflowY='auto'>
            {children}
          </Box>
        </Flex>
        <Footer />
      </Box>
    )
  }

  return null
}