import mime from 'mime-types'

import { Readable } from 'stream'
import { Asset, AssetStatus } from '@prisma/client'
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
import { GetObjectCommandOutput } from '@aws-sdk/client-s3'

@Injectable()
export class StreamService {
  private readonly logger = new Logger(StreamService.name)

  constructor(
    private readonly jobsService: JobsService,
    private readonly assetService: AssetsService,
    private readonly configService: ConfigService,
    private readonly utilitiesService: UtilitiesService
  ) {}

  getDirectAssetKey(asset: Asset): string {
    return `${asset.storageKey}/${this.utilitiesService.getSourceAssetFilename(
      asset
    )}`
  }

  getDirectAssetUrl(asset: Asset): string {
    return `${this.configService.get('ALCOVES_STORAGE_PUBLIC_ENDPOINT')}/${
      asset.storageBucket
    }/${this.getDirectAssetKey(asset)}`
  }

  buildSingleFileManifest(url: string, duration: number) {
    return `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-PLAYLIST-TYPE:VOD
#EXT-X-TARGETDURATION:${duration}
#EXTINF:${duration},
${url}
#EXT-X-ENDLIST`
  }

  async getDirectAssetMetadata(assetId: string) {
    const asset = await this.assetService.findOne(assetId)
    if (!asset) throw new NotFoundException('Asset not found')

    const { ContentLength } = await this.utilitiesService.getObjectMetadata(
      asset.storageBucket,
      this.getDirectAssetKey(asset)
    )

    return {
      fileSize: ContentLength,
    }
  }

  async getDirectAssetStream(
    assetId: string,
    range?: string
  ): Promise<{
    stream: Readable
    contentType: string
    s3Res: GetObjectCommandOutput
  }> {
    const asset = await this.assetService.findOne(assetId)
    if (!asset) throw new NotFoundException('Asset not found')

    const s3Res = await this.utilitiesService.getFileStream(
      asset.storageBucket,
      this.getDirectAssetKey(asset),
      range
    )

    return {
      s3Res,
      contentType: asset.contentType,
      stream: Readable.from(s3Res.Body as Readable),
    }
  }

  async getManifest(id: string) {
    const asset = await this.assetService.findOne(id)
    if (!asset) throw new NotFoundException('Asset not found')
    if (!asset.contentType.includes('video'))
      throw new BadRequestException('asset is not a video')

    const url = await this.getDirectAssetUrl(asset)
    return this.buildSingleFileManifest(url, 30.01)
  }

  async getAssetThumbnail(
    params: GetThumbnailParamsDto,
    query: GetThumbnailQueryDto
  ): Promise<{ stream: Readable; contentType: string; fileSize: number }> {
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
      fileSize: ContentLength,
      stream: Readable.from(Body as Readable),
      contentType: mime.lookup(params.fmt) || 'application/octet-stream',
    }
  }
}
