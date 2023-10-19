import { join } from 'path'
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
    new FastifyAdapter({ logger: false })
  )
  const configService = app.get(ConfigService)
  const port = configService.get('PORT') || 4000

  app.enableCors({
    origin: '*',
    credentials: false,
  })

  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  const config = new DocumentBuilder()
    .setTitle('Alcoves API')
    .setDescription('The API for Alcoves')
    .setVersion('0.1')
    .addTag('alcoves')
    .addBearerAuth()
    .setExternalDoc('Postman Collection', '/api-json')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  )
  // app.useStaticAssets({ root: 'public' })
  // app.setBaseViewsDir(join(__dirname, '..', 'views'))
  // app.setViewEngine({ engine: 'hbs' })

  await app.listen(port, '0.0.0.0')
}
bootstrap()
