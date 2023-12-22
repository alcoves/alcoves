import os from 'os'
import axios from 'axios'

import { join } from 'path'
import { basename } from 'path'
import { PassThrough } from 'stream'
import { mkdtemp } from 'fs/promises'
import { spawn } from 'child_process'
import { readdir, rm } from 'fs/promises'
import { pipeline } from 'stream/promises'
import { Upload } from '@aws-sdk/lib-storage'
import { ConfigService } from '@nestjs/config'
import { Asset, Rendition } from '@prisma/client'
import { Injectable, Logger } from '@nestjs/common'
import { createReadStream, createWriteStream } from 'fs'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import {
  S3,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommandInput,
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
  private s3External: S3
  private readonly logger = new Logger(UtilitiesService.name)

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

    this.logger.verbose(
      'initialized s3 clients',
      JSON.stringify(this.s3),
      JSON.stringify(this.s3)
    )
  }

  createAssetStorageKey(id: string): string {
    return `assets/${id}`
  }

  getManifestURI() {
    const cdnEndpoint = this.config.get('ALCOVES_STORAGE_CDN_URL')
    const publicEndpoint = this.config.get('ALCOVES_STORAGE_PUBLIC_ENDPOINT')
    return cdnEndpoint ? cdnEndpoint : publicEndpoint
  }

  getFileStream(
    bucket: string,
    key: string,
    range?: string
  ): Promise<GetObjectCommandOutput> {
    this.logger.debug({ bucket, key, range })
    const getObjectParams = { Bucket: bucket, Key: key }
    if (range) getObjectParams['Range'] = range
    return this.s3.send(new GetObjectCommand(getObjectParams))
  }

  async uploadFileToStorage2(params: PutObjectCommandInput): Promise<any> {
    try {
      const upload = new Upload({
        client: this.s3,
        params,
      })
      await upload.done()
      return { status: 'Success' }
    } catch (error) {
      this.logger.error('Error in uploadFileToStorage: ', error)
      throw error
    }
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
      this.logger.error('Error in uploadFileToStorage: ', error)
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

  getAssetManifestUrl(asset: Asset): string {
    return `http://localhost:4000/stream/${asset.id}.m3u8`
  }

  getRenditionStorageKey(assetStorageKey: string, renditionId: string): string {
    return `${assetStorageKey}/renditions/${renditionId}`
  }

  private spawnProcess(binary: string, args: string[]): Promise<string> {
    const allowedBinaries = ['ffmpeg', 'ffprobe']
    if (!allowedBinaries.includes(binary)) throw new Error('Invalid binary')

    return new Promise((resolve, reject) => {
      const process = spawn(binary, args)
      this.logger.debug('Spawning Process', `${binary} ${args.join(' ')}`)
      let data = ''
      let errorData = ''

      process.stdout.on('data', (chunk) => {
        data += chunk
      })

      process.stderr.on('data', (chunk) => {
        errorData += chunk
      })

      process.on('error', (error) => {
        this.logger.error('Process error:', error)
        reject(error)
      })

      process.on('exit', (code) => {
        if (code !== 0) {
          this.logger.error(`${binary} exited with code ${code}`, errorData)
          reject(new Error(`${binary} exited with code ${code}: ${errorData}`))
          return
        }

        resolve(data)
      })
    })
  }

  async uploadFile(
    bucketName: string,
    filePath: string,
    remotePathPrefix: string
  ) {
    const filename = basename(filePath)
    const remotePath = `${remotePathPrefix}/${filename}`

    const params = {
      Key: remotePath,
      Bucket: bucketName,
      Body: createReadStream(filePath),
    }

    try {
      await this.s3.send(new PutObjectCommand(params))
      this.logger.log(`File uploaded successfully. ${filePath}`)
    } catch (err) {
      this.logger.error('Error', err)
    }
  }

  async uploadDirectory(
    bucketName: string,
    dirPath: string,
    remotePathPrefix: string
  ) {
    const files = await readdir(dirPath)

    for (const file of files) {
      const filePath = join(dirPath, file)
      await this.uploadFile(bucketName, filePath, remotePathPrefix)
    }
  }

  getExtractionDimensions(index: number): {
    topLeft: { x: number; y: number }
    bottomRight: { x: number; y: number }
  } {
    const standardThumbnailMatrix = {
      rows: 10,
      columns: 6,
      width: 640,
      height: 360,
    }

    const itemRow = Math.floor(index / standardThumbnailMatrix.columns)
    const itemColumn = index % standardThumbnailMatrix.columns

    const topLeft = {
      x: itemColumn * standardThumbnailMatrix.width,
      y: itemRow * standardThumbnailMatrix.height,
    }

    const bottomRight = {
      x: topLeft.x + standardThumbnailMatrix.width,
      y: topLeft.y + standardThumbnailMatrix.height,
    }

    return { topLeft, bottomRight }
  }

  async getObject(bucketName, objectKey, filePath) {
    const getObjectParams = {
      Bucket: bucketName,
      Key: objectKey,
    }

    try {
      const data = await this.s3.send(new GetObjectCommand(getObjectParams))
      await pipeline(data.Body as any, createWriteStream(filePath))
      this.logger.log(`File downloaded successfully to ${filePath}`)
    } catch (err) {
      this.logger.log('Error', err)
    }
  }

  async extractThumbnail(
    asset: Asset,
    tmpDir: string,
    ss: string = '00:00:00'
  ): Promise<{
    thumbnailPath: string
    sharpExtraction: {
      left: number
      top: number
      width: number
      height: number
    }
  }> {
    try {
      const [hours, minutes, seconds] = ss.split(':')
      const thumbnailMinute = parseInt(minutes)
      const thumbnailSecond = parseInt(seconds)

      const storyboardName = `storyboard_${thumbnailMinute + 1}.jpg`
      const tmpThumbnailPath = `${tmpDir}/${storyboardName}`
      const storyboardURI = `${asset.storageKey}/storyboards/${storyboardName}`

      const extractionDimensions = this.getExtractionDimensions(thumbnailSecond)
      this.logger.debug({ storyboardURI, extractionDimensions })

      await this.getObject(asset.storageBucket, storyboardURI, tmpThumbnailPath)

      return {
        thumbnailPath: tmpThumbnailPath,
        sharpExtraction: {
          left: extractionDimensions.topLeft.x,
          top: extractionDimensions.topLeft.y,
          width: 640,
          height: 360,
        },
      }
    } catch (error) {
      this.logger.error(error)
      throw new Error('Failed to extract thumbnail')
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

  async createStoryboards(asset: Asset): Promise<void> {
    const tmpDir = await mkdtemp(join(os.tmpdir(), 'aloves-storyboards-'))

    try {
      this.logger.log('Creating asset storyboards')

      await this.spawnProcess('ffmpeg', [
        '-i',
        asset.input,
        '-vf',
        'fps=1,scale=640:360,tile=6x10', // 6x10 = 60 storyboards per image, or 1 minute per image
        '-q:v',
        '5',
        `${tmpDir}/storyboard_%d.jpg`,
      ])

      const uploadPath = `${asset.storageKey}/storyboards`
      await this.uploadDirectory(asset.storageBucket, tmpDir, uploadPath)

      this.logger.log('Successfully created asset storyboards')
    } catch (error) {
      this.logger.error('Failed to generate asset storyboards')
      this.logger.error(error)
    } finally {
      await rm(tmpDir, { recursive: true })
    }
  }

  async hlsIngestSourceAudio(asset: Asset, rendition: Rendition): Promise<any> {
    try {
      this.logger.log('Ingesting HLS Asset')
      const streamName = 'stream.m3u8'

      await this.spawnProcess('ffmpeg', [
        '-i',
        asset.input,
        '-c:a',
        'aac',
        '-b:a',
        '128k',
        '-ar',
        '48000',
        '-vn',
        '-f',
        'hls',
        '-hls_playlist_type',
        'vod',
        '-hls_segment_type',
        'fmp4',
        // '-master_pl_name',
        // 'main.m3u8 ',
        '-hls_time',
        '10',
        '-hls_list_size',
        '0',
        '-http_persistent',
        '1',
        '-method',
        'PUT',
        `http://localhost:4000/stream/${asset.id}/${rendition.id}/${streamName}`,
      ])

      this.logger.log('Successfully ingested HLS with FFMPEG')
    } catch (error) {
      this.logger.error('Failed to ingest HLS')
      this.logger.error(error)
    }
  }

  async hlsIngestSourceVideo(asset: Asset, rendition: Rendition): Promise<any> {
    try {
      this.logger.log('Ingesting HLS Asset')
      const streamName = 'stream.m3u8'

      await this.spawnProcess('ffmpeg', [
        '-i',
        asset.input,
        '-c:v',
        'copy',
        '-an',
        '-f',
        'hls',
        '-hls_playlist_type',
        'vod',
        '-hls_segment_type',
        'fmp4',
        // '-master_pl_name',
        // 'main.m3u8 ',
        '-hls_time',
        '10',
        '-hls_list_size',
        '0',
        '-http_persistent',
        '1',
        '-method',
        'PUT',
        `http://localhost:4000/stream/${asset.id}/${rendition.id}/${streamName}`,
      ])

      this.logger.log('Successfully ingested HLS with FFMPEG')
    } catch (error) {
      this.logger.error('Failed to ingest HLS')
      this.logger.error(error)
    }
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
      this.logger.error('Error in ingestURLToStorage: ', error)
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

      if (listedObjects.KeyCount === 0) return

      await this.s3.send(
        new DeleteObjectsCommand({
          Bucket: storageBucket,
          Delete: {
            Objects: listedObjects.Contents.map((obj) => {
              this.logger.debug(`Deleting ${storageBucket}/${obj.Key}`)
              return { Key: obj.Key }
            }),
          },
        })
      )

      if (listedObjects.IsTruncated)
        await this.deleteStorageFolder(storageBucket, storageKey)
    } catch (error) {
      this.logger.error(`Failed to delete storage resources`)
      this.logger.error(error)
      throw error
    }
  }
}
