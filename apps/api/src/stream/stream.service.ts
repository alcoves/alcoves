import mime from 'mime-types'
import sharp, { ResizeOptions } from 'sharp'

import { Readable } from 'stream'
import { Asset } from '@prisma/client'
import { ConfigService } from '@nestjs/config'
import { AssetsService } from '../assets/assets.service'
import { UtilitiesService } from '../utilities/utilities.service'
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { FastifyReply } from 'fastify'
import {
  GetThumbnailParamsDto,
  GetThumbnailQueryDto,
} from './dto/getThumbailDto'

@Injectable()
export class StreamService {
  constructor(
    private readonly assetService: AssetsService,
    private readonly configService: ConfigService,
    private readonly utilitiesService: UtilitiesService
  ) {}

  getDirectAssetUrl(asset: Asset): string {
    return `${this.configService.get('ALCOVES_STORAGE_PUBLIC_ENDPOINT')}/${
      asset.storageBucket
    }/${asset.storageKey}/${this.utilitiesService.getSourceAssetFilename(
      asset
    )}`
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

  async getAssetUrl(id: string) {
    const asset = await this.assetService.findOne(id)
    if (!asset) throw new NotFoundException('Asset not found')
    return this.getDirectAssetUrl(asset)
  }

  async getManifest(id: string) {
    const asset = await this.assetService.findOne(id)
    if (!asset) throw new NotFoundException('Asset not found')
    if (!asset.contentType.includes('video'))
      throw new BadRequestException('asset is not a video')

    const url = this.getDirectAssetUrl(asset)
    return this.buildSingleFileManifest(url, 30.01)
  }

  async getAssetThumbnail(
    res: FastifyReply,
    params: GetThumbnailParamsDto,
    query: GetThumbnailQueryDto
  ) {
    const asset = await this.assetService.findOne(params.assetId)
    console.log(asset)

    return res.send('done')

    // TODO :: Keeping this code around for now because it shows a good example of streaming from s3
    // const response = await s3.send(
    //   new GetObjectCommand({
    //     Key: image.storageKey,
    //     Bucket: image.storageBucket,
    //   })
    // )
    // const streamingS3Body = response.Body as Readable

    // // Send the original image if no format is specified
    // if (!query.fmt) {
    //   res.header('Content-Type', image.contentType).send(streamingS3Body)
    //   return
    // }

    // const streamingImageTransformer = sharp()
    //   .toFormat(query.fmt, {
    //     progressive: true,
    //     effort: query.effort || 4,
    //     quality: query.q || 80,
    //   })
    //   .resize(
    //     Object.entries(query).reduce((acc, [k, v]) => {
    //       if (k === 'fit') acc.fit = v
    //       if (k === 'w') acc.width = Number(v)
    //       if (k === 'h') acc.width = Number(v)
    //       return acc
    //     }, {} as ResizeOptions)
    //   )

    // return res
    //   .header('Content-Type', mime.contentType(query.fmt) || image.contentType)
    //   .send(streamingS3Body.pipe(streamingImageTransformer))
  }
}
