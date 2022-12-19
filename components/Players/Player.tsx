'use client'

import useSWR from 'swr'
import Vidstack from './Vidstack/Player'
import { Video } from '../../types/types'
import { useEffect, useState } from 'react'

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Player({ video }: { video: Video }) {
  const [refreshInterval, setRefreshInterval] = useState(3000)

  const { data }: { data: Video; error: undefined } = useSWR(`/api/videos/${video.id}`, fetcher, {
    refreshInterval,
    fallbackData: video,
  })

  useEffect(() => {
    if (data?.progress === 100) setRefreshInterval(0)
  }, [data])

  if (data.progress !== 100) {
    return (
      <div className='flex flex-col w-full aspect-video justify-start items-center'>
        <p className='text-5xl font-semibold'>The video is processing</p>
        <p className='mt-2'>This page will automatically refresh</p>
        <div className='mt-6 w-10 h-10 rounded-full animate-spin border-4 border-solid border-blue-500 border-t-transparent' />
      </div>
    )
  }

  const options = {
    source: data.urls?.m3u8Url,
    metadata: data?.data?.metadata,
    poster: data.urls?.thumbnailUrl,
  }

  return (
    <div className='p-4'>
      <Vidstack key={data.id} options={options} />
    </div>
  )
}
