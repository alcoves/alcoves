import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LocalAuthGuard } from './guards/local-auth-guard';
import { Controller, Post, Req, Res, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth-guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response): Promise<{ access_token: string }> {
    const login = await this.authService.login(req.user)
    
    const date = new Date()
    date.setDate(date.getDate() + 30) // Cookie expires in 30 days
    // TODO :: Refresh tokens
    // https://jakeowen-ex.medium.com/secure-api-authentication-with-nextjs-access-tokens-refresh-tokens-dff873a7ed94

    res.cookie('jwt', login.access_token, {
      expires: date,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    });
    return login
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('jwt', "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    });
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<{ access_token: string }> {
    return this.authService.register(registerUserDto);
  }
}
