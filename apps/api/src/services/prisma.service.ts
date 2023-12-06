import { PrismaClient } from '@prisma/client'
import {
  Logger,
  Injectable,
  OnModuleInit,
  INestApplication,
} from '@nestjs/common'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name)

  async onModuleInit() {
    await this.$connect()
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('exit', async () => {
      this.logger.warn('Disconnecting Prisma Client')
      await this.$disconnect()
      await app.close()
    })
  }
}
