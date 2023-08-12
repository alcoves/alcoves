import { AppService } from './app.service';
import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('/ui', 301)
  getRoot(): string {
    return 'redirect';
  }

  @Get('health')
  getHealth(): string {
    return this.appService.getHealth();
  }
}
