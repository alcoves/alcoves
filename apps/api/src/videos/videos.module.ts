import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { PrismaService } from '../services/prisma.service';

@Module({
  controllers: [VideosController],
  providers: [VideosService, PrismaService],
})
export class VideosModule {}
