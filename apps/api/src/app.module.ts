import { join } from 'path'
import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { JobsModule } from './jobs/jobs.module'
import { AppController } from './app.controller'
import { ImagesModule } from './images/images.module'
import { AssetsModule } from './assets/assets.module'
import { configuration } from './config/configuration'
import { ServeStaticModule } from '@nestjs/serve-static'
import { PrismaService } from './services/prisma.service'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { DeliveryModule } from './delivery/delivery.module'

@Module({
  providers: [AppService, PrismaService],
  controllers: [AppController],
  imports: [
    ServeStaticModule.forRoot({
      renderPath: '/ui*',
      rootPath: join(__dirname, '../..', 'client', 'dist'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    EventEmitterModule.forRoot(),
    JobsModule,
    AssetsModule,
    ImagesModule,
    DeliveryModule,
  ],
})
export class AppModule {}
