'use client'

import axios from 'axios'
import FileRejections from './FileRejections'

import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import React, { useCallback, useState } from 'react'
import { CreateVideoResponse, UploadResponse } from '../../types/types'

const MAX_FILE_SIZE = 1024 * 1024 * 1024

export default function Upload() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback(acceptedFiles => {
    console.log({ acceptedFiles })

    if (acceptedFiles.length) {
      handleUpload(acceptedFiles[0])
    }
  }, [])

  const { fileRejections, isDragActive, getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    maxSize: MAX_FILE_SIZE,
    accept: {
      'video/*': [],
    },
  })

  const onUploadProgress = progressEvent => {
    const { loaded, total } = progressEvent
    let percent = Math.floor((loaded * 100) / total)
    if (percent < 100) {
      setProgress(percent)
      console.log(`${loaded} bytes of ${total} bytes. ${percent}%`)
    }
  }

  async function handleUpload(file: File) {
    try {
      setUploading(true)

      const uploadResponse = await axios.post('/api/uploads')
      const { url, id: uploadId } = uploadResponse.data as UploadResponse

      await axios.put(url, file, {
        onUploadProgress: onUploadProgress,
      })

      const createVideoResponse = await axios.post('/api/videos', { uploadId })
      const { id: videoId } = createVideoResponse.data as CreateVideoResponse
      router.push(`/v/${videoId}`)
    } catch (error) {
      console.error('Error', error)
    }
  }

  if (uploading) {
    return (
      <div className='flex w-screen h-screen items-center justify-center'>
        <div className='flex flex-col w-80 justify-center pt-4'>
          <p className='text-5xl font-semibold'>{`Uploading...${progress}%`}</p>
        </div>
      </div>
    )
  }

  return (
    <div {...getRootProps()} className='flex w-screen h-screen items-center justify-center'>
      <input {...getInputProps()} />
      <div className='flex flex-col justify-center pt-4'>
        {isDragActive ? (
          <p className='text-5xl font-semibold'>{`Let's get started!`}</p>
        ) : (
          <div>
            <p className='text-5xl font-semibold'>Drag a video file anywhere</p>
            <FileRejections fileRejections={fileRejections} />
          </div>
        )}
      </div>
    </div>
  )
}
