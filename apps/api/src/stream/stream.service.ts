import { Asset } from '@prisma/client'
import { ConfigService } from '@nestjs/config'
import { AssetsService } from '../assets/assets.service'
import { UtilitiesService } from '../utilities/utilities.service'
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'

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
}
