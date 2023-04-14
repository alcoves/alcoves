import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AssetsModule } from "./assets/assets.module";
import { StreamsModule } from './streams/streams.module';

@Module({
  providers: [],
  controllers: [AppController],
  imports: [
    AssetsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    StreamsModule,
  ],
})
export class AppModule {}
