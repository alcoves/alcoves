import { AppService } from './app.service'
import { PrismaClient } from '@prisma/client'
import { AppController } from './app.controller'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from './services/prisma.service'

describe('AppController', () => {
  let appController: AppController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, PrismaService],
    }).compile()

    appController = app.get<AppController>(AppController)
    const prisma = new PrismaClient()

    await prisma.$connect()
    const config = await prisma.config.findFirst()
  })

  describe('GET /info', () => {
    it('should return server status', () => {
      expect(appController.getStatus()).toMatchObject({
        status: 'ok',
        is_initialized: false,
      })
    })

    it('should return server status', () => {
      expect(appController.getStatus()).toMatchObject({
        status: 'ok',
        is_initialized: false,
      })
    })
  })
})
