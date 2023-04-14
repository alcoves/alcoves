import { Flex } from '@chakra-ui/react'
import Layout from '../../components/Layout/Layout'
import Invites from '../../components/Invites/Invites'
import ListUsers from '../../components/Users/ListUsers'

export default function UsersPage() {
  return (
    <Layout>
      <Flex p="2">
        <Invites />
      </Flex>
      <ListUsers />
    </Layout>
  )
}
