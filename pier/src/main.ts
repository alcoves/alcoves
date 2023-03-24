import fastifyCookie from '@fastify/cookie';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { PrismaService } from './prisma.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { useRequestLogging } from './middleware/request-logging';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { TracingService } from './tracing.service';
import { LoggingService } from './logging.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );

  // initialize logger
  app.useLogger(app.get(LoggingService));

  // initialize tracing service
  app.get(TracingService);

  // initialize prisma service
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
    .setVersion('1.0')
    .addTag('bken')
    .addBearerAuth()
    .setExternalDoc('Postman Collection', '/docs-json')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(4000);
}
bootstrap();
