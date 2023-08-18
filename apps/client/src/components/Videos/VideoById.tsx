import useSWR from 'swr'
import InputCopy from './InputCopy'
import InputUpdate from './InputUpdate'
import DeleteVideo from './DeleteVideo'

import { DateTime } from 'luxon'
import { Video } from '../../types'
import { useParams } from 'react-router-dom'
import { Box, Heading, Text, VStack } from '@chakra-ui/react'

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
      <Box pb="4">
        <Heading size="md">{data.id}</Heading>
        <Text py="4">
          Created {DateTime.fromISO(data.createdAt).toRelative()}
        </Text>
      </Box>
      <VStack pb="4" maxW="400px">
        <InputUpdate label="Video Name" text={data.id} />
      </VStack>
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
        <VStack pt="4" pb="8" maxW="400px">
          <InputCopy label="Video ID" text={data.id} />
          <InputCopy label="Direct URL" text={directLink} />
          <InputCopy label="Playback URL" text={watchLink} />
        </VStack>
        <Box pb="4">
          <DeleteVideo id={data.id} />
        </Box>
      </Box>
    </>
  ) : null
}
