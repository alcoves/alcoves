import axios from 'axios'
import mime from 'mime-types'

import { PassThrough } from 'stream'
import { spawn } from 'child_process'
import { Asset } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { Upload } from '@aws-sdk/lib-storage'
import { ConfigService } from '@nestjs/config'
import {
  S3,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3'

interface FFprobeData {
  format: {
    filename: string
    duration: string
  }
  streams: {
    codec_type: string
    width?: number
    height?: number
    bit_rate?: number
    sample_rate?: number
    channels?: number
    duration?: string
  }[]
}

@Injectable()
export class UtilitiesService {
  private s3: S3

  constructor(private readonly config: ConfigService) {
    this.s3 = new S3({
      region: 'us-east-1',
      forcePathStyle: true,
      endpoint: this.config.get('ALCOVES_STORAGE_ENDPOINT'),
      credentials: {
        accessKeyId: this.config.get('ALCOVES_STORAGE_ACCESS_KEY_ID'),
        secretAccessKey: this.config.get('ALCOVES_STORAGE_SECRET_ACCESS_KEY'),
      },
    })
  }

  createAssetStorageKey(id: string): string {
    return `assets/${id}`
  }

  getSourceAssetFilename(asset: Asset): string {
    return `${asset.id}.${mime.extension(asset.contentType)}`
  }

  async getMetadata(filePath: string): Promise<FFprobeData> {
    const args = [
      '-v',
      'quiet',
      '-print_format',
      'json',
      '-show_format',
      '-show_streams',
      filePath,
    ]

    return new Promise((resolve, reject) => {
      const ffprobe = spawn('ffprobe', args)
      let data = ''

      ffprobe.stdout.on('data', (chunk) => {
        data += chunk
      })

      ffprobe.on('error', (error) => {
        console.error(error)
        reject(error)
      })

      ffprobe.stderr.on('error', (err: Error) => {
        console.error(err)
      })

      ffprobe.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`FFprobe exited with code ${code}`))
          return
        }

        try {
          const result: FFprobeData = JSON.parse(data)
          resolve(result)
        } catch (error) {
          console.error(error)
          reject(error)
        }
      })
    })
  }

  async ingestURLToStorage(
    input: string,
    contentType: string,
    storageBucket: string,
    storageKey: string
  ): Promise<any> {
    try {
      const pass = new PassThrough()
      const response = await axios.get(input, { responseType: 'stream' })
      response.data.pipe(pass)

      const upload = new Upload({
        client: this.s3,
        params: {
          Body: pass,
          Key: storageKey,
          Bucket: storageBucket,
          ContentType: contentType,
        },
      })

      await upload.done()
      return { status: 'Success', contentType }
    } catch (error) {
      console.error('Error in ingestURLToStorage: ', error)
      throw error
    }
  }

  async deleteStorageFolder(storageBucket: string, storageKey: string) {
    try {
      const listedObjects = await this.s3.send(
        new ListObjectsV2Command({
          Bucket: storageBucket,
          Prefix: storageKey.endsWith('/') ? storageKey : storageKey + '/',
        })
      )

      if (listedObjects.Contents.length === 0) return

      await this.s3.send(
        new DeleteObjectsCommand({
          Bucket: storageBucket,
          Delete: {
            Objects: listedObjects.Contents.map((obj) => {
              console.log(obj.Key)
              return { Key: obj.Key }
            }),
          },
        })
      )

      if (listedObjects.IsTruncated)
        await this.deleteStorageFolder(storageBucket, storageKey)
    } catch (error) {
      console.error(`Failed to delete storage resources`)
      console.error(error)
      throw error
    }
  }
}
