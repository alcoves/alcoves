import { Box, Flex, Link } from '@chakra-ui/react'
import axios from 'axios'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'

import Player from '../../components/Videos/Player'
import { Video } from '../../types/types'
import { getAPIUrl, getThumanailUrl } from '../../utils/urls'

export default function VideoPage({ v }: { v: Video }) {
  const thumbnailImage = getThumanailUrl(v.cdnUrl)

  return (
    <>
      <Head>
        <title>{v?.title || 'bken.io'}</title>
        <meta property='og:title' content={v?.title || 'bken.io'} />
        <meta property='og:type' content='video.movie' />
        <meta property='og:url' content={`https://bken.io/v/${v.id}`} />
        <meta property='og:image' content={thumbnailImage} />
        <meta property='og:image:type' content='image/jpeg' />
        <meta property='og:image:width' content='854' />
        <meta property='og:image:height' content='480' />
        <meta property='og:image:alt' content='bken.io' />
      </Head>
      <Flex w='100vw' h='100vh' justify='space-between' align='center' direction='column'>
        <Box>
          <Player v={v} />
        </Box>
        <Box pb='2'>
          <Link href='https://bken.io'>bken.io</Link>
        </Box>
      </Flex>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const videoId = context?.params?.videoId
  const { data } = await axios.get(`${getAPIUrl()}/videos/${videoId}`)
  return {
    props: {
      v: data?.payload,
    },
  }
}
