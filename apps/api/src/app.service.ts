import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}

  getInfo() {
    return {
      status: 'nominal',
    }
  }

  getConfig() {
    return {
      cdnUrl: this.config.get('ALCOVES_CDN_URL'),
    }
  }
}
