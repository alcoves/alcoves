import { StreamService } from './stream.service'
import { Get, Param, Controller, Header } from '@nestjs/common'

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Get(':assetId.m3u8')
  @Header('Content-Type', 'application/vnd.apple.mpegurl')
  getManifest(@Param('assetId') assetId: string) {
    return this.streamService.getManifest(assetId)
  }
}
