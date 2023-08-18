import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IngestProcessor } from './ingest.processor'
import { PrismaService } from '../../src/services/prisma.service'

@Module({
  providers: [
    ConfigService,
    PrismaService,
    // IngestProcessor
  ],
})
export class ProcessorsModule {}
