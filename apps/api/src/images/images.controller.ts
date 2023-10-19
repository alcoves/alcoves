import { Response } from 'express'
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

  @Get(':id.:format')
  findOne(
    @Param() params: GetImageParamsDto,
    @Query() query: GetImageQueryDto,
    @Res() res: Response
  ) {
    return this.imagesService.findOne(params, query, res)
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
