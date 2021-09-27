import Head from 'next/head'
import moment from 'moment'
import { Flex, Box, Text, Heading } from '@chakra-ui/react'
import Layout from '../../components/Layout'
import VideoPlayer from '../../components/VideoPlayer/Index'
import abbreviateNumber from '../../utils/abbreviateNumber'
import { fetcher } from '../../utils/fetcher'
import { getApiUrl, getTidalUrl } from '../../utils/api'
import { GetServerSidePropsContext } from 'next'
import { Video } from '../../types'

export default function VideoPage(props: { error: boolean; video: Video }): JSX.Element {
  const { error, video } = props
  const videoUrl = `https://bken.io/v/${video._id}`
  const embedUrl = `https://bken.io/embed/${video._id}`
  const hlsUrl = `${getTidalUrl()}/assets/${video.tidal}.m3u8`
  const thumbnailUrl = `https://cdn.bken.io/v/${video.tidal}/thumbnail.jpg`

  const subHeader = `${abbreviateNumber(video.views)} views ·
      ${moment(video.createdAt).fromNow()}`

  if (error) {
    return (
      <Layout>
        <Flex justify='center' flexDirection='column' align='center' pt='25px'>
          <Heading pb='25px'>There was anf error loading the video</Heading>
        </Flex>
      </Layout>
    )
  }

  if (video.status !== 'completed') {
    return (
      <Layout>
        <Flex justify='center' flexDirection='column' align='center' pt='25px'>
          <Heading pb='25px'>This video is not quite ready</Heading>
          <div>Status: {video.status}</div>
        </Flex>
      </Layout>
    )
  }

  return (
    <Box>
      <Head>
        <title>{video.title}</title>
        <meta property='og:site_name' content='bken.io' />
        <meta property='og:url' content={videoUrl} />
        <meta property='og:title' content={video.title} />
        <meta property='og:image' content={thumbnailUrl} />
        <meta property='og:type' content='video.other' />
        <meta property='og:image:width' content='1280' />
        <meta property='og:image:height' content='720' />
        <meta property='og:image:type' content='image/webp' />
        <meta property='og:description' content='' />
        <meta property='og:video:url' content={embedUrl} />
        <meta property='og:video:secure_url' content={embedUrl} />
        <meta property='og:video:type' content='text/html' />
        <meta property='og:video:width' content='1280' />
        <meta property='og:video:height' content='720' />
        <meta property='og:video:tag' content='username' />
        <meta property='og:video:tag' content={video.title} />
        <meta name='og:title' content={video.title} />
        <meta name='description' content={`Watch ${video.title} on bken.io`} />
        <meta name='twitter:card' content='player' />
        <meta name='twitter:url' content={videoUrl} />
        <meta name='twitter:title' content={video.title} />
        <meta name='twitter:description' content='' />
        <meta name='twitter:site' content='@rustyguts' />
        <meta name='twitter:image' content={thumbnailUrl} />
        <meta name='twitter:player' content={embedUrl} />
        <meta name='twitter:player:width' content='1280' />
        <meta name='twitter:player:height' content='720' />
      </Head>
      <Layout>
        <Box>
          <VideoPlayer theaterMode url={hlsUrl} thumbnail={thumbnailUrl} />
          <Flex w='100%' justifyContent='center'>
            <Box p='4' w='1024px'>
              <Heading as='h3' size='lg'>
                {video.title}
              </Heading>
              <Flex justifyContent='space-between'>
                <Text fontSize='sm'>{subHeader}</Text>
                {/* <ShareModal link={`https://bken.io/v/${video.id}`} /> */}
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Layout>
    </Box>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<unknown> {
  // eslint-disable-next-line
  // @ts-ignore
  const { videoId } = context?.params
  const fetchUrl = `${getApiUrl()}/videos/${videoId}`
  try {
    const { data: video } = await fetcher(fetchUrl, context)
    return {
      props: {
        video,
        fetchUrl,
      },
    }
  } catch (error) {
    console.error(error)
    return {
      props: {
        fetchUrl,
        video: {},
        error: false,
      },
    }
  }
}
