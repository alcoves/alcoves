import { join } from 'path'
import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { BullModule } from '@nestjs/bull'
import { AppController } from './app.controller'
import { AssetsModule } from './assets/assets.module'
import { configuration } from './config/configuration'
import { ServeStaticModule } from '@nestjs/serve-static'
import { PrismaService } from './services/prisma.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ProcessorsModule } from './processors/processors.module'

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
      useFactory: (configService: ConfigService) => ({
        redis: {
          port: configService.get('ALCOVES_REDIS_HOST'),
          host: configService.get('ALCOVES_REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    AssetsModule,
  ],
})
export class AppModule {}
