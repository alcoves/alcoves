import axios from '../utils/axios'
import chunkFile from '../utils/chunkFile'
import { useState } from 'react'
import { Upload, UploadsState } from '../types/types'
import { useSWRConfig } from 'swr'

const bypassInterceptorAxios = axios.create()

// const upload = {
//   id: '',
//   file: {},
//   key: '',
//   urls: [],
//   status: '',
//   uploadId: '',
//   progress: {
//     completed: 22.5,
//     lastBytesUploaded: 0,
//   },
// }

export default function useUploads(): UploadsState {
  const { mutate } = useSWRConfig()
  const [uploads, setUploads] = useState<Upload[]>([])

  async function addUpload(file: File, podId: string | string[]) {
    try {
      // Add new upload
      setUploads((prev: any) => [...prev, { file, status: 'started' }])
      const chunks = chunkFile(file)

      // Get signedURLS
      const { data } = await axios.post('http://localhost:4000/media', {
        podId,
        type: file.type,
        size: file.size,
        filename: file.name,
        chunks: chunks.length,
      })

      console.log('createUploadRes data', data.payload)
      const urls: string[] = data?.payload?.upload?.urls || []

      await Promise.all(
        chunks.map((chunk, i) => {
          console.log(`uploading part ${i} to ${urls[i]}`)
          // let lastBytesLoaded = 0
          return bypassInterceptorAxios.put(urls[i], chunk, {
            onUploadProgress: e => {
              console.log(e.loaded)
              // const deltaUploaded = e.loaded - lastBytesLoaded
              // setBytesUploaded(p => p + deltaUploaded)
              // lastBytesLoaded = e.loaded
            },
          })
        })
      )

      await axios.put('http://localhost:4000/media/', {
        id: data?.payload?.media.id,
        key: data?.payload?.upload.key,
        uploadId: data?.payload?.upload.uploadId,
      })
    } catch (error) {
      console.log(`failed to upload ${file}`)
      // updateUpload(file.name, { status: 'failed' })
    } finally {
      // updateUpload(file.name, { status: 'completed' })
      mutate(`http://localhost:4000/media?podId=${podId}`)
    }
  }

  return { uploads, addUpload }
}
