import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(user: User): Promise<{ access_token: string }> {
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
      }, {
        secret: process.env.JWT_SECRET
      }),
    };
  }

  async register({ email, username, password}: {email: string, username: string, password: string}): Promise<{ access_token: string }> {
    const user = await this.usersService.createOne({
      email,
      username,
      password: await this.hashPassword(password),
    })

    return this.login(user)
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null

    const passwordMatched = await this.comparePasswords(password, user.password)
    if (passwordMatched) return user
    return null;
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, process.env.SALT_ROUNDS)
  }

  async comparePasswords(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword)
  }
}
