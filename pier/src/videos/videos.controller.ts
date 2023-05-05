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
import { CreateVideoInput, RescanVideoInput } from './dto/dto'

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  async create(@Body() data: CreateVideoInput) {
    const video = await this.videosService.create(data)
    return { video }
  }

  @Post('rescan')
  rescan(@Body() data: RescanVideoInput) {
    return this.videosService.rescan(data)
  }

  @Get()
  async findAll(@Query('tag') tag: string) {
    const query: any = {
      include: {
        tags: true,
        playbacks: true,
        thumbnails: {
          orderBy: {
            size: 'asc',
          },
        },
      },
      orderBy: {
        authoredAt: 'desc',
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

  @Get(':id/playbacks/:playbackId')
  playbackOneStream(
    @Param('id') id: string,
    @Param('playbackId') playbackId: string,
    @Res() res: Response,
    @Req() req: Request
  ) {
    return this.videosService.playbackOne(id, playbackId, req, res)
  }

  @Get(':id/thumbnails/:thumbnailId')
  getOneThumbnail(
    @Param('id') id: string,
    @Param('thumbnailId') thumbnailId: string,
    @Res() res: Response,
    @Req() req: Request
  ) {
    return this.videosService.getThumbnail(id, thumbnailId, req, res)
  }

  @Post(':id/thumbnails')
  reprocessVideoThumbnails(@Param('id') id: string) {
    return this.videosService.reprocessVideoThumbnails(id)
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
