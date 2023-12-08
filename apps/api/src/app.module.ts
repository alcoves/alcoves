import { join } from 'path'
import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { BullModule } from '@nestjs/bull'
import { JobsModule } from './jobs/jobs.module'
import { AppController } from './app.controller'
import { StreamModule } from './stream/stream.module'
import { AssetsModule } from './assets/assets.module'
import { configuration } from './config/configuration'
import { ServeStaticModule } from '@nestjs/serve-static'
import { PrismaService } from './services/prisma.service'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UtilitiesService } from './utilities/utilities.service'

@Module({
  providers: [AppService, PrismaService, UtilitiesService],
  controllers: [AppController],
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('ALCOVES_REDIS_HOST'),
          port: configService.get('ALCOVES_REDIS_PORT'),
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'client', 'dist'),
    }),
    EventEmitterModule.forRoot(),
    JobsModule,
    AssetsModule,
    StreamModule,
  ],
})
export class AppModule {}
