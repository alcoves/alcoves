import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import useSWR from 'swr'

import ReprocessButton from '../components/Admin/ReprocessButton'
import Card from '../components/Card'
import Layout from '../components/Layout'
import { Video } from '../types/types'
import { fetcher } from '../utils/axios'
import { getAPIUrl } from '../utils/urls'

export default function AdminPage() {
  const { data } = useSWR(`${getAPIUrl()}/admin/videos`, fetcher)

  return (
    <Layout>
      <Flex p='2' direction='column'>
        <Box p='2'>Admin UI</Box>
        {data ? (
          <VStack spacing={1}>
            {data?.payload?.map((v: Video) => {
              return (
                <Card key={v.id}>
                  <Flex p='2' justify='space-between'>
                    <pre>{JSON.stringify(v, null, 2)}</pre>

                    <ReprocessButton videoId={v.id} />
                  </Flex>
                </Card>
              )
            })}
          </VStack>
        ) : (
          <Text>Loading</Text>
        )}
      </Flex>
    </Layout>
  )
}
