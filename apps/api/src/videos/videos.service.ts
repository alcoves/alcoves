import { Queue } from 'bull'
import { Queues } from '../types/types'
import { Prisma } from '@prisma/client'
import { InjectQueue } from '@nestjs/bull'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../services/prisma.service'
import { IngestJob } from '../processors/ingest.processor'
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'

@Injectable()
export class VideosService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    @InjectQueue(Queues.ingest.name) private ingestQueue: Queue
  ) {}

  async create(input: string) {
    if (!input) throw new BadRequestException()

    const video = await this.prisma.videos.create({
      data: {
        title: 'Test',
      },
    })

    const ingestJob = await this.ingestQueue.add('ingestFromURL', {
      input,
      videoId: video.id,
    } as IngestJob['data'])

    console.log('Created video', ingestJob.queue.name, ingestJob.id)
    const jobs = await this.ingestQueue.getJobCounts()

    return { video, jobs }
  }

  async findAll() {
    const videos = await this.prisma.videos.findMany()
    return videos
  }

  async findOne(id: string) {
    const video = await this.prisma.videos.findUnique({
      where: { id },
    })
    if (!video) throw new NotFoundException()
    return video
  }

  async update(id: string, data: Prisma.VideosUpdateInput) {
    const video = await this.prisma.videos.update({
      data,
      where: { id },
    })
    return video
  }

  async remove(id: string) {
    const video = await this.prisma.videos.findUnique({
      where: { id },
    })
    if (!video) throw new NotFoundException()

    // await fs.unlink(video.filepath).catch((e) => {
    //   console.error('failed to delete video file')
    // })

    await this.prisma.videos.delete({
      where: { id },
    })
  }

  async watchOne(id: string) {
    const video = await this.prisma.videos.findUniqueOrThrow({
      where: { id },
    })

    return {
      ready: true,
      title: 'Test',
      posterAlt: 'test',
      videoUrl: this.originalVideoURL(video.id),
    }
  }

  originalVideoURL(id: string) {
    return `${this.storagePrefixDomain(id)}/original.mp4`
  }

  storagePrefixDomain(id: string) {
    const storageDomain = this.configService.get<string>('STORAGE_DOMAIN')
    const storageBucket = this.configService.get<string>('STORAGE_BUCKET')
    const storageBucketVideoPrefix = this.configService.get<string>(
      'STORAGE_BUCKET_VIDEO_PREFIX'
    )

    return `${storageDomain}/${storageBucket}/${storageBucketVideoPrefix}/${id}`
  }
}
