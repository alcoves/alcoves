import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { InvitesModule } from './invites/invites.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth-guard';
import { UserRolesGuard } from './roles/userRoles.guard';
import { AlcoveRolesGuard } from './roles/alcoveRoles.guard';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { LoggingService } from './logging.service';
import { AlcovesModule } from './alcoves/alcoves.module';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      inject: [Reflector],
      useFactory: (ref) => new JwtAuthGuard(ref),
    },
    {
      provide: APP_GUARD,
      useClass: UserRolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AlcoveRolesGuard,
    },
    LoggingService,
    PrismaService,
  ],
  controllers: [AppController],
  exports: [LoggingService],
  imports: [
    AuthModule,
    UsersModule,
    InvitesModule,
    AlcovesModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
