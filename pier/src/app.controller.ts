import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth-guard';
import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }
}
