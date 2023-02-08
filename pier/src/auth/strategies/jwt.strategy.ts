import { Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(validationPayload: {
    email: string;
    sub: string;
  }): Promise<any> {
    // TODO ::
    // We don't need to fetch the user on every request, defeats the purpose of JWT
    // For conveinice, we should probably have a decorator that pulls the user in
    // const user = await this.userService.findByEmail(validationPayload.email);
    // return user;
    return true
  }
}
