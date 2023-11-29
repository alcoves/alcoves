import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractAPIKeyFromHeader(request)

    console.log(token, this.configService.get('ALCOVES_TOKEN'))

    if (!token) throw new UnauthorizedException()

    try {
      const apiKey = this.configService.get('ALCOVES_TOKEN')
      if (token !== apiKey) throw new UnauthorizedException()
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }

  private extractAPIKeyFromHeader(request: FastifyRequest): string | undefined {
    console.log(request.headers)
    const token = request.headers.authorization
    return token
  }
}
