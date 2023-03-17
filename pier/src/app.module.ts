import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { InvitesModule } from './invites/invites.module';

@Module({
  providers: [PrismaService],
  controllers: [AppController],
  imports: [
    AuthModule,
    UsersModule,
    InvitesModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
