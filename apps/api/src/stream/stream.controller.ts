import mime from 'mime-types'

import { Request, Response } from 'express'
import { StreamService } from './stream.service'
import {
  GetThumbnailQueryDto,
  GetThumbnailParamsDto,
} from './dto/getThumbailDto'
import {
  Res,
  Put,
  Req,
  Get,
  Query,
  Param,
  Header,
  Controller,
} from '@nestjs/common'

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Get(':assetId.m3u8')
  @Header('Content-Type', 'application/vnd.apple.mpegurl')
  getManifest(@Param('assetId') assetId: string) {
    const assetIdOnly = assetId.split('.m3u8')[0]
    return this.streamService.getManifest(assetIdOnly)
  }

  @Get(':assetId/thumbnail.:fmt')
  async getAssetThumbnail(
    @Res() res: Response,
    @Param() params: GetThumbnailParamsDto,
    @Query() query: GetThumbnailQueryDto
  ) {
    const { stream, contentType, fileSize, error } =
      await this.streamService.getAssetThumbnail(params, query)
    res.set({
      'Content-Length': fileSize,
      'Content-Type': contentType,
      'Cache-Control': error ? '0' : 'max-age=2678400',
      'Content-Disposition': `inline; filename="thumbnail.${mime.extension(
        contentType
      )}"`,
    })

    stream.pipe(res)
  }

  @Put(':assetId/:renditionId/:assetName')
  async uploadChunk(
    @Req() req: Request,
    @Param('assetId') assetId: string,
    @Param('assetName') assetName: string,
    @Param('renditionId') renditionId: string
  ) {
    return this.streamService.uploadChunk(req, assetId, renditionId, assetName)
  }
}
