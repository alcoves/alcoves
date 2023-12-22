import * as Sentry from '@sentry/node'

import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'
import { NestApplication, NestFactory } from '@nestjs/core'
import { ProfilingIntegration } from '@sentry/profiling-node'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule, {
    bufferLogs: true,
    logger: ['log', 'fatal', 'error', 'warn', 'debug'], // 'verbose (trace)'
  })

  const configService = app.get(ConfigService)
  const port = configService.get('PORT') || 4000
  const sentryDsn = configService.get('ALCOVES_SENTRY_DSN')

  if (sentryDsn) {
    console.log('Sentry DSN found, enabling Sentry')
    Sentry.init({
      dsn: sentryDsn,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Express({
          app: app.getHttpAdapter().getInstance(),
        }),
        new ProfilingIntegration(),
      ],
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
    })

    app.use(Sentry.Handlers.requestHandler())
    app.use(Sentry.Handlers.tracingHandler())
    app.use(Sentry.Handlers.errorHandler())
  }

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
