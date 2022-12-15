import useSWR from 'swr'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import axios from '../../config/axios'
import Layout from '../../components/Layout'

import { Video } from '../../types/types'
import { useEffect, useState } from 'react'
import { GetServerSidePropsContext } from 'next'
import { Box, Flex, Heading, Link, Spinner, Text } from '@chakra-ui/react'

const VideoPlayerNoSSR = dynamic(() => import('../../components/VideoPlayer'), {
  ssr: false,
})

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function VideoPage({ v }: { v: Video }) {
  const [refreshInterval, setRefreshInterval] = useState(3000)

  const { data, error }: { data: Video; error: undefined } = useSWR(
    `/api/videos/${v.id}`,
    fetcher,
    {
      refreshInterval,
      fallbackData: v,
    }
  )

  const videoJsOptions = {
    muted: true,
    autoplay: true,
    controls: true,
    fluid: true,
    responsive: true,
    poster: data?.urls?.thumbnailUrl,
    sources: [
      {
        src: data.urls.dashUrl,
        type: 'application/dash+xml',
      },
      {
        src: data.urls.m3u8Url,
        type: 'application/x-mpegURL',
      },
    ],
  }

  useEffect(() => {
    if (data?.progress === 100) setRefreshInterval(0)
  }, [data])

  const publicURL = `https://bken.io/v/${data?.id}`
  const ogDescription = 'Watch this video on bken.io'

  if (error) {
    return (
      <Layout>
        <Heading>There was an error</Heading>
      </Layout>
    )
  }

  if (data?.progress !== 100) {
    return (
      <>
        <Head>
          <title>{'bken.io'}</title>
        </Head>
        <Layout>
          <Flex w='100%' justify='center'>
            <Flex direction='column' align='center' w='400px'>
              <Flex align='end'>
                <Heading pr='4'>Processing</Heading>
                <Spinner mb='1' size='md' />
              </Flex>
              <Text>This page will automatically reload</Text>
            </Flex>
          </Flex>
        </Layout>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{'bken.io'}</title>
        <meta property='og:title' content={data?.id} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={publicURL} />
        <meta property='og:image' content={data?.urls?.thumbnailUrl} />
        <meta property='og:image:type' content='image/avif' />
        <meta property='og:image:width' content='1280' />
        <meta property='og:image:height' content='720' />
        <meta property='og:image:alt' content='bken.io' />
        <meta name='description' content={ogDescription} />
        <meta property='og:description' content={ogDescription} />
        {/* Twitter tags */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta property='twitter:url' content={publicURL} />
        <meta name='twitter:title' content={'bken.io'} />
        <meta name='twitter:description' content={ogDescription} />
        <meta name='twitter:image' content={data?.urls?.thumbnailUrl} />
      </Head>
      <Layout>
        <Box>
          <Flex justify='center' p='4' pt='4' h='100%' w='100%'>
            <Box w='1280px' maxW='1280px' h='720px' maxH='720px'>
              <VideoPlayerNoSSR key={data?.id} options={videoJsOptions} />
            </Box>
          </Flex>
          <Flex h='100px' direction='column' align='center'>
            <Flex pt='2'>
              <Heading p='0' m='0' size='xs' fontWeight='600'>
                <Link href='/'>bken.io</Link>
              </Heading>
            </Flex>
          </Flex>
        </Box>
      </Layout>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query
  return axios
    .get(`${process.env.TIDAL_API_ENDPOINT}/videos/${id}`)
    .then(({ data }) => {
      return { props: { v: data } }
    })
    .catch(err => {
      return { props: {} }
    })
}
