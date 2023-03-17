import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { InvitesModule } from './invites/invites.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth-guard';
import { RolesGuard } from './roles/roles.guard';
import { APP_GUARD, Reflector } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      inject: [Reflector],
      useFactory: (ref) => new JwtAuthGuard(ref),
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    PrismaService,
  ],
  controllers: [AppController],
  imports: [
    AuthModule,
    UsersModule,
    InvitesModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
