import { AssetsService } from './assets.service'
import { Controller, Get, Param } from '@nestjs/common'

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  async listAssets(path: string) {
    const assets = await this.assetsService.findAll(path)
    return { assets }
  }

  @Get('/*')
  async findAll(@Param() params: string[]) {
    const path = params[0]
    return this.listAssets(path)
  }

  @Get('/')
  async findAllRoot(@Param() params: string[]) {
    const path = params[0]
    return this.listAssets(path)
  }
}
