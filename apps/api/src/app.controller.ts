import { FastifyReply } from 'fastify'
import { ApiTags } from '@nestjs/swagger'
import { AppService } from './app.service'
import { Controller, Get, Res } from '@nestjs/common'

@ApiTags('Root')
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

  @Get('/api/redoc')
  getDocs(@Res() reply: FastifyReply) {
    reply.type('text/html').send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Alcoves API</title>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
          <body>
          <redoc spec-url='/api/spec-json' required-props-first=true></redoc>
          <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
        </body>
      </html>
    `)
  }
}
