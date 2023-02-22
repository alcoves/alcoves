import { FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LocalAuthGuard } from './guards/local-auth-guard';
import { Controller, Post, Req, Res, Body, UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<{ access_token: string }> {
    const login = await this.authService.login(req.user);

    // TODO :: Refresh tokens
    // https://jakeowen-ex.medium.com/secure-api-authentication-with-nextjs-access-tokens-refresh-tokens-dff873a7ed94

    res.setCookie('jwt', login.access_token, {
      path: '/',
      httpOnly: true,
      signed: process.env.NODE_ENV === 'production',
    });
    return login;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: FastifyReply) {
    res.clearCookie('jwt');
  }

  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<{ access_token: string }> {
    return this.authService.register(registerUserDto);
  }
}
