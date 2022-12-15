'use client'

import useSWR from 'swr'
import VideoJS from './VideoJS'
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

  const videoJsOptions = {
    muted: true,
    fluid: true,
    autoplay: true,
    controls: true,
    responsive: true,
    poster: data.urls?.thumbnailUrl,
    sources: [
      {
        src: data.urls?.dashUrl,
        type: 'application/dash+xml',
      },
      {
        src: data.urls?.m3u8Url,
        type: 'application/x-mpegURL',
      },
    ],
  }

  if (data.progress !== 100) {
    return (
      <div className='flex flex-col w-full aspect-video justify-start items-center'>
        <p className='text-5xl font-semibold'>The video is processing</p>
        <p className='mt-2'>This page will automatically refresh</p>
        <div className='mt-6 w-10 h-10 rounded-full animate-spin border-4 border-solid border-blue-500 border-t-transparent' />
      </div>
    )
  }

  return (
    <div className='w-full aspect-video bg-black'>
      <VideoJS key={data.id} options={videoJsOptions} />
    </div>
  )
}
