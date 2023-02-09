import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { PrismaService } from './prisma.service';
import { useRequestLogging } from './middleware/request-logging';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  app.use(cookieParser())
  useRequestLogging(app);
  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true
  });
  await app.listen(3001);
}
bootstrap();
