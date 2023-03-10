import { Box, Flex } from '@chakra-ui/react'
import Layout from '../../components/Layout/Layout'
import InviteUser from '../../components/Users/InviteUser'
import ListUsers from '../../components/Users/ListUsers'

export default function UsersPage() {
  return (
    <Layout>
      <Flex p='2'>
        <InviteUser />
      </Flex>
      <ListUsers />
    </Layout>
  )
}
