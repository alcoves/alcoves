import useSWR from 'swr'
import DeleteVideo from './DeleteVideo'

import { Video } from '../../types'
import { Box, Input, VStack } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import InputCopy from '../InputCopy'

export default function VideoById({ video }: { video?: Video }) {
  const { id } = useParams()
  const { data, error } = useSWR(`/videos/${id}`, {
    fallbackData: video,
  })

  if (error) {
    return <div>failed to load</div>
  }

  const directLink = `http://localhost:4000/videos/${data?.id}/stream`
  const watchLink = `http://localhost:4000/videos/${data?.id}/watch`

  return data?.id ? (
    <>
      <h1>Video by id</h1>
      {data?.id}
      <Box>
        <Box position="relative" pt="56.25%">
          <iframe
            src={watchLink}
            style={{
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              position: 'absolute',
            }}
            allowFullScreen
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          ></iframe>
        </Box>

        <VStack py="4" maxW="400px">
          <InputCopy label="Video ID" text={data.id} />
          <InputCopy label="Direct URL" text={directLink} />
          <InputCopy label="Playback URL" text={watchLink} />
        </VStack>

        <Box py="4">
          <DeleteVideo id={data.id} />
        </Box>
      </Box>
    </>
  ) : null
}
