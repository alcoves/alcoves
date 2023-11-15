import { ApiTags } from '@nestjs/swagger'
import { AssetsService } from './assets.service'
import { CreateAssetDto } from './dto/create-asset.dto'
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'

@ApiTags('Assets')
@Controller('api/assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  findAll() {
    return this.assetsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetsService.findOne(id)
  }

  @Post()
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetsService.create(createAssetDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assetsService.remove(id)
  }
}
