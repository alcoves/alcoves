import { Module } from '@nestjs/common'
import { VideosService } from './videos.service'
import { VideosController } from './videos.controller'
import { MulterModule } from '@nestjs/platform-express'
import { PrismaService } from '../services/prisma.service'

@Module({
  imports: [
    MulterModule.register({
      dest: '/data/uploads',
    }),
  ],
  controllers: [VideosController],
  providers: [VideosService, PrismaService],
})
export class VideosModule {}
