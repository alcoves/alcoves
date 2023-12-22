import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractAPIKeyFromHeader(request)

    if (!token) throw new UnauthorizedException()

    try {
      const apiKey = this.configService.get('ALCOVES_TOKEN')
      if (token !== apiKey) throw new UnauthorizedException()
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }

  private extractAPIKeyFromHeader(req): string | undefined {
    const token = req.headers.authorization
    return token
  }
}
