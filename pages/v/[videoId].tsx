import moment from 'moment'
import Head from 'next/head'
import VideoPlayer from '../../components/VideoPlayer'
import abbreviateNumber from '../../utils/abbreviateNumber'
import { Video } from '../../types'
import { fetcher } from '../../utils/fetcher'
import { GetServerSidePropsContext } from 'next'
import { getApiUrl, getTidalUrl } from '../../utils/api'
import { Flex, Box, Text, Heading } from '@chakra-ui/react'

export default function VideoPage(props: { video: Video }): JSX.Element {
  const { video } = props
  const videoUrl = `https://bken.io/v/${video?._id}`
  const embedUrl = `https://bken.io/embed/${video?._id}`
  const hlsUrl = `${getTidalUrl()}/assets/${video?.tidal}.m3u8`
  const thumbnailUrl = `https://cdn.bken.io/v/${video?.tidal}/thumbnail.jpg`

  const subHeader = `${abbreviateNumber(video?.views)} views ·
      ${moment(video?.createdAt).fromNow()}`

  const videoJsOptions = {
    fluid: true,
    autoplay: true,
    controls: true,
    responsive: true,
    poster: thumbnailUrl,
    sources: [
      {
        src: hlsUrl,
        type: 'application/x-mpegURL',
      },
    ],
  }

  if (video) {
    if (video?.status !== 'completed') {
      return (
        <Flex justify='center' flexDirection='column' align='center' pt='25px'>
          <Heading pb='25px'>Video is processing</Heading>
          <div>Status: {video.status}</div>
        </Flex>
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
        <Flex h='100vh' w='100vw' align='center' justify='center' direction='column'>
          <Box width='100%' maxW='calc((16 / 9) * 80vh)'>
            <VideoPlayer {...videoJsOptions} />
            <Box pt='4'>
              <Heading as='h3' size='lg'>
                {video.title}
              </Heading>
              <Flex justifyContent='space-between'>
                <Text fontSize='sm'>{subHeader}</Text>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Box>
    )
  }

  return (
    <Flex justify='center' flexDirection='column' align='center' pt='25px'>
      <Head>
        <title>{'Not Found'}</title>
        <meta property='og:site_name' content='bken.io' />
      </Head>
      <Heading pb='25px'>Video Not Found</Heading>
    </Flex>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<unknown> {
  const { videoId } = context.params!
  const fetchUrl = `${getApiUrl()}/videos/${videoId}`

  try {
    const { data: video } = await fetcher(fetchUrl, context)
    if (video) return { props: { video } }
  } catch (error) {
    console.error('error fetching video')
    return { notFound: true }
  }

  return { props: {} }
}
