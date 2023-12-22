import { Job } from 'bull'
import { v4 as uuid } from 'uuid'
import { Logger } from '@nestjs/common'
import { Process, Processor } from '@nestjs/bull'
import { PrismaService } from '../../services/prisma.service'
import { UtilitiesService } from '../../utilities/utilities.service'
import { IngestJobs, IngestUrlJobData, Queues } from '../jobs.constants'

@Processor(Queues.INGEST)
export class IngestProcessor {
  private readonly logger = new Logger(IngestProcessor.name)

  constructor(
    private readonly prismaService: PrismaService,
    private readonly utilitiesService: UtilitiesService
  ) {}

  @Process({
    concurrency: 3,
    name: IngestJobs.INGEST_URL,
  })
  async process(job: Job<IngestUrlJobData>) {
    const asset = await this.prismaService.asset.findFirst({
      where: { id: job.data.assetId },
    })

    try {
      await this.prismaService.asset.update({
        where: { id: job.data.assetId },
        data: {
          version: 1,
          status: 'INGESTING',
        },
      })

      this.logger.debug('Removing existing renditions')
      const existingRenditions = await this.prismaService.rendition.findMany({
        where: {
          assetId: job.data.assetId,
        },
      })

      for (const rendition of existingRenditions) {
        await this.prismaService.rendition.delete({
          where: { id: rendition.id },
        })
      }

      this.logger.debug('Removing asset folder')
      await this.utilitiesService.deleteStorageFolder(
        asset.storageBucket,
        asset.storageKey
      )

      this.logger.debug('Collecting asset metadata')
      const metadata = await this.utilitiesService.getMetadata(asset.input)
      const hasAudio = metadata?.streams.some(
        (stream) => stream.codec_type === 'audio'
      )

      if (hasAudio) {
        this.logger.debug('Creating rendition for source audio')
        const sourceAudioRenditionId = uuid()
        const sourceAudioRendition = await this.prismaService.rendition.create({
          data: {
            asset: { connect: { id: job.data.assetId } },
            id: sourceAudioRenditionId,
            storageBucket: asset.storageBucket,
            storageKey: this.utilitiesService.getRenditionStorageKey(
              asset.storageKey,
              sourceAudioRenditionId
            ),
          },
        })

        await this.utilitiesService.hlsIngestSourceAudio(
          asset,
          sourceAudioRendition
        )

        await this.prismaService.rendition.update({
          where: { id: sourceAudioRenditionId },
          data: {
            status: 'PROCESSING',
          },
        })
      }

      this.logger.debug('Creating rendition for source video')
      const sourceVideoRenditionId = uuid()
      const sourceVideoRendition = await this.prismaService.rendition.create({
        data: {
          asset: { connect: { id: job.data.assetId } },
          id: sourceVideoRenditionId,
          storageBucket: asset.storageBucket,
          storageKey: this.utilitiesService.getRenditionStorageKey(
            asset.storageKey,
            sourceVideoRenditionId
          ),
        },
      })

      await this.utilitiesService.hlsIngestSourceVideo(
        asset,
        sourceVideoRendition
      )

      await this.prismaService.rendition.update({
        where: { id: sourceVideoRenditionId },
        data: {
          status: 'PROCESSING',
        },
      })

      this.logger.debug('Creating asset thumbnails')
      await this.utilitiesService.createStoryboards(asset)

      this.logger.debug('Finalizing asset')
      await this.prismaService.asset.update({
        where: { id: job.data.assetId },
        data: {
          status: 'READY',
          metadata: metadata as any,
          duration: parseFloat(metadata.format.duration),
        },
      })
    } catch (error) {
      this.logger.error('there was an error ingesting the asset', error)
      await this.prismaService.asset.update({
        where: { id: job.data.assetId },
        data: { status: 'ERROR' },
      })

      throw new Error(error)
    }

    await job.progress(100)
    return 'done'
  }
}
