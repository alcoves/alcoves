import React from 'react'
import useSWR from 'swr'
import Layout from '../components/Layout'
import { fetcher } from '../utils/fetcher'
import ListPods from '../components/ListPods'
import { Box, Heading } from '@chakra-ui/react'

export default function Index({ url, response }) {
  const { data } = useSWR(url, fetcher, { fallbackData: response.payload })
  return (
    <Layout>
      <Box px='2'>
        <Heading py='2'> Your Pods </Heading>
        <ListPods data={data.payload} />
      </Box>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const requestUrl = `http://localhost:3100/pods`
  const response = await fetcher(requestUrl, context)
  return { props: { response, url: requestUrl } }
}
