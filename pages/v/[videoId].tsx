import { Box, Flex, Link } from '@chakra-ui/react'
import axios from 'axios'
import { GetServerSidePropsContext } from 'next'

import Player from '../../components/Videos/Player'
import { Video } from '../../types/types'
import { getAPIUrl } from '../../utils/urls'

export default function VideoPage({ v }: { v: Video }) {
  return (
    <Flex w='100vw' h='100vh' justify='space-between' align='center' direction='column'>
      <Box>
        <Player v={v} />
      </Box>
      <Box pb='2'>
        <Link href='https://bken.io'>bken.io</Link>
      </Box>
    </Flex>
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
