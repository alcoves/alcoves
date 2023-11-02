import { AppService } from './app.service'
import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getRoot(): any {
    return this.appService.getInfo()
  }

  @Get('/health')
  getHealthcheck(): any {
    return this.appService.getInfo()
  }
}
