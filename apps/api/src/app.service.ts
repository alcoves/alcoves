import { Injectable } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getInfo(): Promise<any> {
    return {
      status: 'nominal',
    }
  }
}
