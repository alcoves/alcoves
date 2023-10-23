import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { ImagesService } from './images.service'
import { CreateImageDto } from './dto/create-image.dto'
import { UpdateImageDto } from './dto/update-image.dto'
import { GetImageParamsDto, GetImageQueryDto } from './dto/get-image-dto'

@Controller('images')
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

  // What about seperating the transformations api from the data api?
  // assets/images/:imageId
  // assets/videos/:videoId
  // playback/videos/:videoId
  // playback/images/:imageId
  @Get(':id/transform')
  transformOne(
    @Param() params: GetImageParamsDto,
    @Query() query: GetImageQueryDto,
    @Res() res: FastifyReply
  ) {
    return this.imagesService.transformOne(params, query, res)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imagesService.update(+id, updateImageDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(+id)
  }
}
