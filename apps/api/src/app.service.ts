import { Injectable } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getInfo(): Promise<any> {
    const config = await this.prisma.config.findFirst()
    return {
      ...config,
      isSetup: !!config,
      status: 'nominal',
    }
  }
}
