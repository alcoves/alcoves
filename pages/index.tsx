import React from 'react'
import useSWR from 'swr'
import Layout from '../components/Layout'
import { fetcher } from '../utils/fetcher'
import ListPods from '../components/ListPods'
import { Box, Heading } from '@chakra-ui/react'
import { getSession } from 'next-auth/client'

export default function Index({ url, pods }) {
  const { data } = useSWR(url, fetcher, { fallbackData: pods })

  return (
    <Layout>
      <Box px='2'>
        <Heading py='2'> Your Pods </Heading>
        <ListPods data={data} />
      </Box>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (session) {
    console.log(session)
    const userApiKey = session?.user?.apiKey
    const urlPath = '/pods'
    const pods = await fetcher(`http://localhost:3100${urlPath}`, {
      headers: { 'X-API-Key': userApiKey },
    })
    return { props: { pods, urlPath } }
  }

  return { props: {} }
}
