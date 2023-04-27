import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TagsModule } from './tags/tags.module'
import { AppController } from './app.controller'
import { VideosModule } from './videos/videos.module'

@Module({
  providers: [],
  controllers: [AppController],
  imports: [VideosModule, ConfigModule.forRoot({ isGlobal: true }), TagsModule],
})
export class AppModule {}
