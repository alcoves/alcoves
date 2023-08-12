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
} from '@nestjs/common'
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
}
