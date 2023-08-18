import { join } from 'path'
import { Queues } from './types/types'
import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { BullModule } from '@nestjs/bull'
import { AppController } from './app.controller'
import { VideosModule } from './videos/videos.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ProcessorsModule } from './processors/processors.module'

@Module({
  providers: [AppService],
  controllers: [AppController],
  imports: [
    ServeStaticModule.forRoot({
      renderPath: '/ui*',
      rootPath: join(__dirname, '../..', 'client', 'dist'),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          port: configService.get('REDIS_PORT'),
          host: configService.get('REDIS_HOST'),
        },
      }),
      inject: [ConfigService],
    }),
    VideosModule,
    ProcessorsModule,
  ],
})
export class AppModule {}
