import { Request } from 'express'
import { AssetsService } from './assets.service'
import { Controller, Get, Param, Req } from '@nestjs/common'

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  async listAssets(path: string) {
    const assets = await this.assetsService.findAll(path)
    return { assets }
  }

  @Get('/*')
  async findAll(@Req() req: Request, @Param() params: any) {
    const path = params[0]
    return this.listAssets(path)
  }

  @Get('/')
  async findAllRoot(@Req() req: Request, @Param() params: any) {
    const path = params[0]
    return this.listAssets(path)
  }
}
