import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LocalAuthGuard } from './guards/local-auth-guard';
import { Controller, Post, Req, Body, UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req): Promise<{ access_token: string }> {
    return this.authService.login(req.user)
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<{ access_token: string }> {
    return this.authService.register(registerUserDto);
  }
}
