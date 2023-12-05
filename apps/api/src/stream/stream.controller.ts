import { FastifyReply } from 'fastify'
import { StreamService } from './stream.service'
import {
  Get,
  Param,
  Controller,
  Header,
  Redirect,
  Res,
  Query,
} from '@nestjs/common'
import {
  GetThumbnailParamsDto,
  GetThumbnailQueryDto,
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

  @Get(':assetId/thumbnail')
  async getAssetThumbnail(
    @Res() res: FastifyReply,
    @Param() params: GetThumbnailParamsDto,
    @Query() query: GetThumbnailQueryDto
  ) {
    return this.streamService.getAssetThumbnail(res, params, query)
  }

  @Get(':assetId.m3u8')
  @Header('Content-Type', 'application/vnd.apple.mpegurl')
  getManifest(@Param('assetId') assetId: string) {
    return this.streamService.getManifest(assetId)
  }
}
