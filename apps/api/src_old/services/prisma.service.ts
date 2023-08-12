import { PrismaClient } from '@prisma/client'
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('exit', async () => {
      await app.close()
    })
    // Deprecated
    // this.$on('beforeExit', async () => {
    //   await app.close()
    // })
  }
}
