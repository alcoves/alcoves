import configuration from './config/configuration'

import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { TagsModule } from './tags/tags.module'
import { AppController } from './app.controller'
import { VideosModule } from './videos/videos.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ProcessorsModule } from './processors/processors.module'

@Module({
  providers: [],
  controllers: [AppController],
  imports: [
    TagsModule,
    VideosModule,
    ProcessorsModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          port: configService.get('REDIS_PORT'),
          host: configService.get('REDIS_HOST'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
