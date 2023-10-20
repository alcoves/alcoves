import { join } from 'path'
import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { BullModule } from '@nestjs/bull'
import { JobsModule } from './jobs/jobs.module'
import { AppController } from './app.controller'
import { ImagesModule } from './images/images.module'
import { configuration } from './config/configuration'
import { ServeStaticModule } from '@nestjs/serve-static'
import { PrismaService } from './services/prisma.service'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  providers: [AppService, PrismaService],
  controllers: [AppController],
  imports: [
    ServeStaticModule.forRoot({
      renderPath: '/ui*',
      rootPath: join(__dirname, '../..', 'client', 'dist'),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          redis: {
            host: configService.get('ALCOVES_REDIS_HOST'),
            port: configService.get('ALCOVES_REDIS_PORT'),
          },
        }
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ImagesModule,
    JobsModule,
  ],
})
export class AppModule {}
