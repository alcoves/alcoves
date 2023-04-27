import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  Query,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Request, Response } from 'express'
import { VideosService } from './videos.service'

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  async create(@Body() data: Prisma.VideoCreateInput) {
    const video = await this.videosService.create(data)
    return { video }
  }

  @Post('rescan')
  rescan() {
    return this.videosService.rescan()
  }

  @Get()
  async findAll(@Query('tag') tag: string) {
    const query: any = {
      include: {
        tags: true,
      },
    }
    if (tag) query.where = { tags: { some: { id: tag } } }

    const videos = await this.videosService.findAll(query)
    return { videos }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const video = await this.videosService.findOne(id)
    return { video }
  }

  @Get(':id/stream')
  findOneStream(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request
  ) {
    return this.videosService.streamOne(id, req, res)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: Prisma.VideoUpdateInput) {
    const video = await this.videosService.update(id, data)
    return { video }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const video = await this.videosService.remove(id)
    return { video }
  }
}
