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
} from '@nestjs/common'

@ApiTags('Assets')
@UseGuards(AuthGuard)
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
