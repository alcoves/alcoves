import { AppModule } from './app.module'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
    {
      bufferLogs: true,
      logger: ['log', 'fatal', 'error', 'warn', 'debug'], // 'verbose (trace)'
    }
  )
  const configService = app.get(ConfigService)
  const port = configService.get('PORT') || 4000

  app.enableCors({
    origin: '*',
    credentials: false,
  })

  const config = new DocumentBuilder()
    .setTitle('Alcoves API')
    .setDescription('The API for Alcoves')
    .setVersion('0.1')
    .addBearerAuth()
    .setExternalDoc('Redoc Docs', '/api/redoc')
    .setExternalDoc('Postman Collection', '/api/spec-json')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/spec', app, document)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  )

  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)
  await app.listen(port, '0.0.0.0')
}
bootstrap()
