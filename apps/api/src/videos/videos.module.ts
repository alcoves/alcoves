import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { VideosService } from './videos.service'
import { VideosController } from './videos.controller'
import { PrismaService } from '../services/prisma.service'
import { ProcessorsModule } from '../processors/processors.module'

@Module({
  imports: [ProcessorsModule],
  controllers: [VideosController],
  providers: [VideosService, PrismaService, ConfigService],
})
export class VideosModule {}
