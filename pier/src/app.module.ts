import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';

@Module({
  providers: [PrismaService],
  controllers: [AppController],
  imports: [AuthModule, UsersModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule {}
