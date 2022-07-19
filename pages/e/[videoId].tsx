import { Box } from '@chakra-ui/react'
import axios from 'axios'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'

import EmbeddedPlayer from '../../components/Player/EmbeddedPlayer'
import { Video } from '../../types/types'
import { getAPIUrl, getPublicUrl } from '../../utils/urls'

export default function VideoPage({ v }: { v: Video }) {
  const publicURL = getPublicUrl(v?.id)
  const ogDescription = 'Watch this video on bken.io'

  if (!v) return null

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
      <Box background='white' w='100vw' h='100vh'>
        <EmbeddedPlayer v={v} />
      </Box>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const videoId = context?.params?.videoId
  const { data } = await axios.get(`${getAPIUrl()}/videos/${videoId}`)

  if (data?.payload) {
    return {
      props: {
        v: data?.payload,
      },
    }
  }

  return { props: {} }
}
