import axios from 'axios'
import mime from 'mime-types'

import { PassThrough } from 'stream'
import { spawn } from 'child_process'
import { Asset } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { Upload } from '@aws-sdk/lib-storage'
import { ConfigService } from '@nestjs/config'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import {
  S3,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { createReadStream } from 'fs'
import { stat } from 'fs/promises'

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
  private s3External: S3

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

    this.s3External = new S3({
      region: 'us-east-1',
      forcePathStyle: true,
      endpoint: this.config.get('ALCOVES_STORAGE_PUBLIC_ENDPOINT'),
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

  async uploadFileToStorage(
    filePath: string,
    contentType: string,
    storageBucket: string,
    storageKey: string
  ): Promise<any> {
    try {
      const upload = new Upload({
        client: this.s3,
        params: {
          Body: createReadStream(filePath),
          Key: storageKey,
          Bucket: storageBucket,
          ContentType: contentType,
        },
      })

      await upload.done()
      return { status: 'Success', contentType }
    } catch (error) {
      console.error('Error in uploadFileToStorage: ', error)
      throw error
    }
  }

  async getSignedUrl({
    key,
    bucket,
    external = false,
  }: {
    key: string
    bucket: string
    external?: boolean
  }): Promise<string> {
    const signedUrl = await getSignedUrl(
      external ? this.s3External : this.s3,
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
      {
        expiresIn: 60 * 60 * 24 * 7, // 7 days,
      }
    )
    return signedUrl
  }

  async getSignedUrlExternal({
    bucket,
    key,
  }: {
    bucket: string
    key: string
  }): Promise<string> {
    const url = await this.getSignedUrl({
      bucket,
      key,
      external: true,
    })
    return url
  }

  async getSignedSourceAssetUrl(asset: Asset): Promise<string> {
    return this.getSignedUrl({
      bucket: asset.storageBucket,
      key: `${asset.storageKey}/${this.getSourceAssetFilename(asset)}`,
    })
  }

  private spawnProcess(binary: string, args: string[]): Promise<string> {
    const allowedBinaries = ['ffmpeg', 'ffprobe']
    if (!allowedBinaries.includes(binary)) throw new Error('Invalid binary')

    return new Promise((resolve, reject) => {
      const process = spawn(binary, args)
      console.log('spawned process', binary, args)
      let data = ''

      process.stdout.on('data', (chunk) => {
        data += chunk
      })

      process.on('error', (error) => {
        console.error(error)
        reject(error)
      })

      process.stderr.on('error', (err: Error) => {
        console.error(err)
      })

      process.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`${binary} exited with code ${code}`))
          return
        }

        try {
          resolve(data)
        } catch (error) {
          console.error(error)
          reject(error)
        }
      })
    })
  }

  async getThumbnail(asset: Asset, path: string): Promise<void> {
    const input = await this.getSignedSourceAssetUrl(asset)
    await this.spawnProcess('ffmpeg', [
      '-i',
      input,
      '-ss',
      '00:00:00',
      '-vframes',
      '1',
      path,
    ])

    try {
      await stat(path)
    } catch (error) {
      console.error(error)
      throw new Error('Failed to get thumbnail')
    }
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

    const metadata = await this.spawnProcess('ffprobe', args)
    const result: FFprobeData = JSON.parse(metadata)
    return result
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
