import mime from 'mime-types'

import { Request } from 'express'
import { PassThrough, Readable } from 'stream'
import { PrismaService } from '../services/prisma.service'
import { Asset, AssetStatus, Rendition } from '@prisma/client'
import { ConfigService } from '@nestjs/config'
import { JobsService } from '../jobs/jobs.service'
import { AssetsService } from '../assets/assets.service'
import { UtilitiesService } from '../utilities/utilities.service'
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import {
  GetThumbnailParamsDto,
  GetThumbnailQueryDto,
} from './dto/getThumbailDto'
import { createReadStream } from 'fs'
import { stat } from 'fs/promises'

@Injectable()
export class StreamService {
  private readonly logger = new Logger(StreamService.name)

  constructor(
    private readonly jobsService: JobsService,
    private readonly assetService: AssetsService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly utilitiesService: UtilitiesService
  ) {}

  uploadChunk(
    req: Request,
    assetId: string,
    renditionId: string,
    assetName: string
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const rendition = await this.prismaService.rendition.findUnique({
        where: {
          id: renditionId,
        },
      })

      if (!rendition) {
        reject()
      }

      const pass = new PassThrough()

      const params = {
        Body: pass,
        Bucket: rendition.storageBucket,
        ContentType: mime.contentType(assetName) || '',
        Key: `${rendition.storageKey}/${assetName}`,
      }

      this.utilitiesService
        .uploadFileToStorage2(params)
        .then(() => {
          resolve('done')
        })
        .catch(() => {
          reject()
        })
      req.pipe(pass)
    })
  }

  buildAudioRenditions(renditions: Rendition[], assetId) {
    return renditions
      .filter((r) => (r?.metadata as any)?.streams[0]?.codec_type === 'audio')
      .map((r) => {
        // this.logger.debug(JSON.stringify(r.metadata, null, 2))
        const assetEndpoint = this.utilitiesService.getManifestURI()
        const channels = (r?.metadata as any)?.streams[0]?.channels
        const codec = (r?.metadata as any)?.streams[0]?.codec_name

        const playlistURL = `${assetEndpoint}/alcoves/assets/${assetId}/renditions/${r.id}/stream.m3u8`
        return `#EXT-X-MEDIA:TYPE=AUDIO,CODECS="${codec}",GROUP-ID="audio",NAME="Default",CHANNELS="${channels}",AUTOSELECT="YES",DEFAULT="YES",LANGUAGE="und",URI="${playlistURL}"`
      })
  }

  buildVideoRenditions(renditions: Rendition[], assetId) {
    return renditions
      .filter((r) => (r?.metadata as any)?.streams[0]?.codec_type === 'video')
      .map((r) => {
        // this.logger.debug(JSON.stringify(r.metadata, null, 2))
        const resolution = `${(r?.metadata as any)?.streams[0]?.width}x${(
          r?.metadata as any
        )?.streams[0]?.height}`
        const bandwidth = (r?.metadata as any)?.streams.map(
          (s) => s.bit_rate
        )[0]
        const codecs = (r?.metadata as any)?.streams
          .map((s) => s.codec_tag_string)
          .join(',')

        const firstLine = `#EXT-X-STREAM-INF:BANDWIDTH="${bandwidth}",RESOLUTION="${resolution}",AUDIO="audio",CLOSED-CAPTIONS=NONE`

        const assetEndpoint = this.utilitiesService.getManifestURI()
        const playlistURL = `${assetEndpoint}/alcoves/assets/${assetId}/renditions/${r.id}/stream.m3u8`
        return `${firstLine}\n${playlistURL}`
      })
  }

  async buildSingleFileManifest(assetId: string) {
    this.logger.log('Building manifest')

    const notReadyRenditions = await this.prismaService.rendition.findMany({
      where: {
        status: {
          not: 'READY',
        },
        assetId,
      },
    })

    for (const r of notReadyRenditions) {
      if (r.status !== 'READY') {
        try {
          const internalStorageEndpoint = this.configService.get(
            'ALCOVES_STORAGE_ENDPOINT'
          )
          const renditionURI = `${internalStorageEndpoint}/${r.storageBucket}/${r.storageKey}/stream.m3u8`
          const metadata = await this.utilitiesService.getMetadata(renditionURI)

          this.logger.debug(
            `Updating rendition: ${r.id} with metadata and status READY`
          )
          await this.prismaService.rendition.update({
            where: {
              id: r.id,
            },
            data: {
              status: 'READY',
              metadata: metadata as any,
            },
          })
        } catch (error) {
          this.logger.error(
            `Failed to get metadata for ${r.id}, but it could still be processing...`
          )
        }
      }
    }

    const renditions = await this.prismaService.rendition.findMany({
      where: {
        assetId,
        status: 'READY',
      },
    })

    const audioRenditions = this.buildAudioRenditions(renditions, assetId)
    const videoRenditions = this.buildVideoRenditions(renditions, assetId)

    if (!audioRenditions.length && !videoRenditions.length) {
      throw new BadRequestException('No renditions found')
    }

    const manifest = [
      '#EXTM3U',
      '#EXT-X-VERSION:5',
      '#EXT-X-INDEPENDENT-SEGMENTS',
      '',
      ...audioRenditions,
      ...videoRenditions,
    ]

    return manifest.join('\n')
  }

  async getManifest(assetId: string) {
    const asset = await this.assetService.findOne(assetId)
    if (!asset) throw new NotFoundException('Asset not found')
    if (!asset.contentType.includes('video'))
      throw new BadRequestException('asset is not a video')

    return this.buildSingleFileManifest(assetId)
  }

  async getAssetThumbnail(
    params: GetThumbnailParamsDto,
    query: GetThumbnailQueryDto
  ): Promise<{
    stream: Readable
    contentType: string
    fileSize: number
    error: boolean
  }> {
    try {
      const asset = await this.assetService.findOne(params.assetId)

      if (!asset.contentType.includes('video')) {
        throw new BadRequestException('asset is not a video')
      }

      if (asset.status !== AssetStatus.READY) {
        throw new BadRequestException('asset is not ready')
      }

      this.logger.log('enqueueing thumbnail job')
      const job = await this.jobsService.thumbnailAsset(asset.id, query, params)

      this.logger.log('waiting for job to complete...', job.id)
      const result = await job.finished()

      this.logger.log('job is done', result)
      const { Body, ContentLength } = await this.utilitiesService.getFileStream(
        result.bucket,
        result.key
      )

      return {
        error: false,
        fileSize: ContentLength,
        stream: Readable.from(Body as Readable),
        contentType: mime.lookup(params.fmt) || 'application/octet-stream',
      }
    } catch (error) {
      this.logger.error(`Thumbnail error, returning default thumbnail`)
      this.logger.error(error)
      return {
        error: true,
        fileSize: (await stat('./data/default_thumbnail.png')).size,
        stream: createReadStream('./data/default_thumbnail.png'),
        contentType: 'image/png',
      }
    }
  }
}
