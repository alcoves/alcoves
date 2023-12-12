import { FastifyReply } from 'fastify'
import { StreamService } from './stream.service'
import {
  GetThumbnailQueryDto,
  GetThumbnailParamsDto,
} from './dto/getThumbailDto'
import {
  Res,
  Get,
  Query,
  Param,
  Header,
  Controller,
  StreamableFile,
  Headers,
  Logger,
} from '@nestjs/common'

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Get(':assetId')
  @Header('Cache-Control', 'public, max-age=31536000, immutable')
  async getDirectAssetStream(
    @Res() res: FastifyReply,
    @Headers('range') range: string,
    @Param('assetId') assetId: string
  ): Promise<StreamableFile> {
    if (range) {
      const { fileSize } =
        await this.streamService.getDirectAssetMetadata(assetId)
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunksize = end - start + 1
      const rangeQuery = `bytes=${start}-${end}`

      const { stream, contentType } =
        await this.streamService.getDirectAssetStream(assetId, rangeQuery)

      return res
        .status(206)
        .headers({
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': contentType,
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        })
        .send(stream)
    }

    const { stream, contentType, fileSize } =
      await this.streamService.getDirectAssetStream(assetId)

    Logger.verbose('123')
    return res
      .status(200)
      .headers({
        'Accept-Ranges': 'bytes',
        'Content-Length': fileSize,
        'Content-Type': contentType,
      })
      .send(stream)
  }

  @Get(':assetId/thumbnail.:fmt')
  @Header('Cache-Control', 'public, max-age=31536000, immutable')
  async getAssetThumbnail(
    @Res() res: FastifyReply,
    @Param() params: GetThumbnailParamsDto,
    @Query() query: GetThumbnailQueryDto
  ) {
    const { stream, contentType, fileSize } =
      await this.streamService.getAssetThumbnail(params, query)
    return res
      .headers({
        'Content-Length': fileSize,
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="thumbnail.${params.fmt}"`,
      })
      .send(stream)
  }

  @Get(':assetId.m3u8')
  @Header('Content-Type', 'application/vnd.apple.mpegurl')
  getManifest(@Param('assetId') assetId: string) {
    return this.streamService.getManifest(assetId)
  }
}
