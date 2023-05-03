import configuration from './config/configuration'

import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TagsModule } from './tags/tags.module'
import { AppController } from './app.controller'
import { VideosModule } from './videos/videos.module'

@Module({
  providers: [],
  controllers: [AppController],
  imports: [
    TagsModule,
    VideosModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
  ],
})
export class AppModule {}
