import { Flex, Heading, Link } from '@chakra-ui/react'
import axios from 'axios'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'

import Player from '../../components/Videos/Player'
import { Video } from '../../types/types'
import { getAPIUrl, getPublicUrl, getThumanailUrl } from '../../utils/urls'

export default function VideoPage({ v }: { v: Video }) {
  const publicURL = getPublicUrl(v?.id)
  const ogDescription = 'Watch this video on bken.io'
  const thumbnailURL = getThumanailUrl(v?.cdnUrl)

  return (
    <>
      <Head>
        <title>{v?.title || 'bken.io'}</title>
        <meta property='og:title' content={v?.title || 'bken.io'} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={publicURL} />
        <meta property='og:image' content={thumbnailURL} />
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
        <meta name='twitter:image' content={thumbnailURL} />
      </Head>
      <Flex w='100vw' h='100vh' justify='start' align='center' direction='column'>
        <Flex px='4' pt='4' h='auto' maxH='calc(100% - 100px)'>
          <Player v={v} />
        </Flex>
        <Flex
          pt='4'
          px='4'
          pb='1'
          w='100%'
          h='100%'
          align='center'
          textAlign='center'
          direction='column'
          justify='space-between'
        >
          <Heading size='md' fontWeight='800'>
            {v.title}
          </Heading>
          <Flex>
            <Heading p='0' m='0' size='xs' fontWeight='600'>
              <Link href='https://bken.io'>bken.io</Link>
            </Heading>
          </Flex>
        </Flex>
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
