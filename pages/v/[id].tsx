import axios from 'axios'
import Head from 'next/head'
import VideoFrame from '../../components/VideoFrame'

import { Video } from '../../types/types'
import { GetServerSidePropsContext } from 'next'
import { Box, Flex, Heading, Link } from '@chakra-ui/react'

export default function VideoPage({ v }: { v: Video }) {
  const publicURL = `https://bken.io/v/${v.id}`
  const ogDescription = 'Watch this video on bken.io'

  return (
    <>
      <Head>
        <title>{v?.title || 'bken.io'}</title>
        <meta property='og:title' content={v?.title || 'bken.io'} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={publicURL} />
        <meta property='og:image' content={v.thumbnailUrl} />
        <meta property='og:image:type' content='image/jpeg' />
        <meta property='og:image:width' content='854' />
        <meta property='og:image:height' content='480' />
        <meta property='og:image:alt' content='bken.io' />
        <meta name='description' content={ogDescription} />
        <meta property='og:description' content={ogDescription} />
        {/* Twitter tags */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta property='twitter:url' content={publicURL} />
        <meta name='twitter:title' content={v?.title || 'bken.io'} />
        <meta name='twitter:description' content={ogDescription} />
        <meta name='twitter:image' content={v.thumbnailUrl} />
      </Head>
      <Box>
        <Flex p='4' pt='4' justify='center'>
          <Box rounded='md'>
            <VideoFrame v={v} muted={false} autoplay={true} />
          </Box>
        </Flex>
        <Flex h='100px' direction='column' align='center'>
          <Heading size='md' fontWeight='800'>
            {v.title}
          </Heading>
          <Flex pt='2'>
            <Heading p='0' m='0' size='xs' fontWeight='600'>
              <Link href='https://bken.io'>bken.io</Link>
            </Heading>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query
  const fetchUrl = `${process.env.TIDAL_API_ENDPOINT}/videos/${id}`
  const result = await axios.get(fetchUrl, {
    headers: {
      'x-api-key': process.env.TIDAL_API_KEY,
    },
  })

  return { props: { v: result.data } }
}
