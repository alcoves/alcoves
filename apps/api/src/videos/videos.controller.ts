import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile,
} from '@nestjs/common'
import { Response } from 'express'
import { Prisma } from '@prisma/client'
import { VideosService } from './videos.service'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File) {
    return this.videosService.create(file)
  }

  @Get()
  findAll() {
    return this.videosService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.VideosUpdateInput) {
    return this.videosService.update(id, data)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videosService.remove(id)
  }

  @Get(':id/stream')
  async streamVideo(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<StreamableFile> {
    return this.videosService.streamOne(id, res)
  }
}
