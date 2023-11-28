import { Asset } from '@prisma/client'
import { ConfigService } from '@nestjs/config'
import { AssetsService } from '../assets/assets.service'
import { PrismaService } from '../services/prisma.service'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

@Injectable()
export class StreamService {
  constructor(
    private readonly assetService: AssetsService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService
  ) {}

  getDirectAssetUrl(asset: Asset): string {
    return 'test'
    // return `${this.configService.get('ALCOVES_STORAGE_PUBLIC_ENDPOINT')}/${
    //   asset.storageBucket
    // }/${asset.storageKey}/${this.assetService.getSourceAssetFilename(asset)}`
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

  async getManifest(id: string) {
    const asset = await this.prismaService.asset.findFirst({
      where: { id },
    })
    if (!asset) throw new NotFoundException('Asset not found')
    if (!asset.contentType.includes('video'))
      throw new BadRequestException('asset is not a video')

    const url = this.getDirectAssetUrl(asset)
    return this.buildSingleFileManifest(url, 30)
  }
}
