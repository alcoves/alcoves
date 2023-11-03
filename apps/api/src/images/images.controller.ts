import { FastifyReply } from 'fastify'
import { ApiTags } from '@nestjs/swagger'
import { ImagesService } from './images.service'
import { CreateImageDto } from './dto/create-image.dto'
import { GetImageParamsDto, GetImageQueryDto } from './dto/get-image-dto'
import { Controller, Get, Post, Body, Param, Res, Query } from '@nestjs/common'

@ApiTags('Images (Deprecated)')
@Controller('api/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  create(@Body() createImageDto: CreateImageDto) {
    return this.imagesService.create(createImageDto)
  }

  @Get()
  findAll() {
    return this.imagesService.findAll()
  }

  @Get(':id')
  findOne(@Param() params: GetImageParamsDto) {
    return this.imagesService.findOne(params.id)
  }

  @Get(':id/transform')
  transformOne(
    @Param() params: GetImageParamsDto,
    @Query() query: GetImageQueryDto,
    @Res() res: FastifyReply
  ) {
    return this.imagesService.transformOne(params, query, res)
  }
}
