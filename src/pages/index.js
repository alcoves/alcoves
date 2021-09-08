import React, { useEffect } from 'react'
import useSWR from 'swr'
import { Box, Heading } from '@chakra-ui/react'
import Layout from '../components/Layout'
import VideoGrid from '../components/VideoGrid/Index'
import { fetcher } from '../utils/fetcher'

export default function Index({ url, videos }) {
  const { data } = useSWR(url, fetcher, { fallbackData: videos })

  useEffect(() => {
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  }, [])

  return (
    <Layout>
      <Box px='2'>
        <Heading py='2'> Latest Videos </Heading>
        <VideoGrid videos={data} />
        <ins
          className='adsbygoogle'
          style={{ display: 'block' }}
          data-ad-client='ca-pub-1017771648826122'
          data-ad-slot='1395737646'
          data-ad-format='auto'
          data-full-width-responsive='true'
        />
      </Box>
    </Layout>
  )
}

export async function getServerSideProps() {
  const urlPath = '/api/videos'
  const videos = await fetcher(`http://localhost:3000${urlPath}`)
  return { props: { videos, urlPath } }
}
