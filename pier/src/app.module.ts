import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './svc/prisma.service';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth-guard';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { LoggingService } from './svc/logging.service';
import { AlcovesModule } from './alcoves/alcoves.module';
import { AbilityModule } from './ability/ability.module';
import { PlatformAbilityGuard } from './ability/abilities.guard';
import { MediaModule } from './media/media.module';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      inject: [Reflector],
      useFactory: (ref) => new JwtAuthGuard(ref),
    },
    {
      provide: APP_GUARD,
      useClass: PlatformAbilityGuard,
    },
    LoggingService,
    PrismaService,
  ],
  controllers: [AppController],
  exports: [LoggingService],
  imports: [
    AuthModule,
    UsersModule,
    AlcovesModule,
    AbilityModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MediaModule,
  ],
})
export class AppModule {}
