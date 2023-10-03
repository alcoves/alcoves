import { PrismaClient } from '@prisma/client'
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()

    const config = await this.config.findFirst()

    if (!config) {
      await this.config.create({
        data: {
          id: 1,
        },
      })
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('exit', async () => {
      console.log('Disconnecting Prisma Client')
      await this.$disconnect()
      await app.close()
    })
  }
}
