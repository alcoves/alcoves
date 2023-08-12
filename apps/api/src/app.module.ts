import { join } from 'path';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { AppController } from './app.controller';
import { VideosModule } from './videos/videos.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [AppService],
  controllers: [AppController],
  imports: [
    ServeStaticModule.forRoot({
      renderPath: '/ui*',
      rootPath: join(__dirname, '../..', 'client', 'dist'),
    }),
    VideosModule,
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
