import axios from '../utils/axios'
import chunkFile from '../utils/chunkFile'
import { nanoid } from 'nanoid'
import { useSWRConfig } from 'swr'
import { useEffect, useState } from 'react'
import { Upload, UploadsState } from '../types/types'
import usePods from './usePods'

const bypassInterceptorAxios = axios.create()

export default function useUploads(): UploadsState {
  const { pods } = usePods()
  const { mutate } = useSWRConfig()
  const [uploads, setUploads] = useState<any>({})

  async function addUpload(file: File) {
    const uploadId = nanoid()
    setUploads((prev: any) => {
      return {
        ...prev,
        [uploadId]: { file, status: 'queued', completed: 0 },
      }
    })
  }

  function updateItem(id: string, value: Upload) {
    setUploads((prev: any) => {
      return {
        ...prev,
        [id]: value,
      }
    })
  }

  // function removeItem(id: string) {
  //   setUploads((prev: any) => {
  //     delete prev[id]
  //     return { ...prev }
  //   })
  // }

  async function startUpload(id: string, upload: any) {
    try {
      // console.log('Starting upload of item', upload)
      upload.status = 'started'
      updateItem(id, upload)

      const chunks = chunkFile(upload.file)

      const { data } = await axios.post('http://localhost:4000/uploads', {
        type: upload.file.type,
        size: upload.file.size,
        filename: upload.file.name,
        chunks: chunks.length,
      })

      // console.log('createUploadRes data', data.payload)
      const urls: string[] = data?.payload?.upload?.urls || []

      upload.status = 'uploading'
      updateItem(id, upload)

      await Promise.all(
        chunks.map((chunk, i) => {
          console.log(`uploading part ${i} to ${urls[i]}`)
          let lastBytesLoaded = 0
          return bypassInterceptorAxios.put(urls[i], chunk, {
            onUploadProgress: e => {
              const deltaUploaded = e.loaded - lastBytesLoaded
              console.log(e.loaded, deltaUploaded, lastBytesLoaded, upload.completed)
              upload.completed = upload.completed + deltaUploaded
              updateItem(id, upload)
              lastBytesLoaded = e.loaded
            },
          })
        })
      )

      await axios.put('http://localhost:4000/uploads', {
        id: data?.payload?.media.id,
        key: data?.payload?.upload.key,
        uploadId: data?.payload?.upload.uploadId,
      })
    } catch (error) {
      // console.log('Error uploading')
      upload.status = 'error'
      updateItem(id, upload)
    } finally {
      // console.log('Completing Upload')
      // removeItem(id)

      const defaultPod = pods.filter((p: any) => p.isDefault)
      if (defaultPod.length) {
        mutate(`http://localhost:4000/pods/${defaultPod[0].id}/media`)
      }
    }
  }

  useEffect(() => {
    console.log('Upload updated', uploads)
    Object.entries(uploads).map((e: any) => {
      const [k, v]: [string, Upload] = e
      if (v.status === 'queued') {
        startUpload(k, v)
      }
    })
  }, [uploads])

  return { uploads, addUpload }
}
