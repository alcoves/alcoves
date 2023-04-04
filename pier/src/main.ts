import tracing from './svc/tracer';
import fastifyCookie from '@fastify/cookie';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { PrismaService } from './svc/prisma.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { useRequestLogging } from './middleware/request-logging';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { LoggingService } from './svc/logging.service';

async function bootstrap() {
  tracing?.start();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useLogger(app.get(LoggingService));

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });

  useRequestLogging(app);

  app.enableCors({
    origin: 'http://localhost:3000', // TODO :: Interpolate this value.
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Pier API')
    .setDescription('The API for Reef')
    .setVersion('0.1')
    .addTag('alcoves')
    .addBearerAuth()
    .setExternalDoc('Postman Collection', '/api-json')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(4000);
}
bootstrap();
