import { StreamService } from './stream.service'
import { Get, Query, Param, Header, Redirect, Controller } from '@nestjs/common'
import {
  GetThumbnailQueryDto,
  GetThumbnailParamsDto,
} from './dto/getThumbailDto'

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Get(':assetId')
  @Redirect('', 302)
  async getAsset(@Param('assetId') assetId: string) {
    return {
      url: await this.streamService.getAssetUrl(assetId),
    }
  }

  @Get(':assetId/thumbnail.:fmt')
  @Redirect('', 302)
  async getAssetThumbnail(
    @Param() params: GetThumbnailParamsDto,
    @Query() query: GetThumbnailQueryDto
  ) {
    return this.streamService.getAssetThumbnail(params, query)
  }

  @Get(':assetId.m3u8')
  @Header('Content-Type', 'application/vnd.apple.mpegurl')
  getManifest(@Param('assetId') assetId: string) {
    return this.streamService.getManifest(assetId)
  }
}
