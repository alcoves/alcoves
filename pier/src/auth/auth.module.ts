import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { UsersService } from '../users/users.service';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [UsersService, AuthService, LocalStrategy],
})
export class AuthModule {}
