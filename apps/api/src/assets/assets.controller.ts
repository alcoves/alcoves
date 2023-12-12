import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '../auth/auth.guard'
import { AssetsService } from './assets.service'
import { CreateAssetDto } from './dto/create-asset.dto'
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common'
import { GetAssetsQueryDto } from './dto/getAssetsDto'

@ApiTags('Assets')
@UseGuards(AuthGuard)
@Controller('api/assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  findAll(@Query() query: GetAssetsQueryDto) {
    return this.assetsService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetsService.findOne(id)
  }

  @Post(':id/retry-ingest')
  retryIngest(@Param('id') id: string) {
    return this.assetsService.retryIngest(id)
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
