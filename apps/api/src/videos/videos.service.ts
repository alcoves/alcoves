import { Queue } from 'bull'
import { Queues } from '../types/types'
import { Prisma } from '@prisma/client'
import { InjectQueue } from '@nestjs/bull'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../services/prisma.service'
import { IngestJob } from '../processors/ingest.processor'
import { Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class VideosService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    @InjectQueue(Queues.ingest.name) private ingestQueue: Queue
  ) {}

  async create(input: string) {
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

    const vsp = this.storagePrefix(video.id)

    return {
      title: 'Test',
      posterAlt: 'test',
      videoUrl: `${vsp}/original.mp4`,
    }
  }

  storagePrefix(id: string) {
    const storageBucket = this.configService.get<string>('STORAGE_BUCKET')
    const storageBucketVideoPrefix = this.configService.get<string>(
      'STORAGE_BUCKET_VIDEO_PREFIX'
    )

    return `${storageBucket}/${storageBucketVideoPrefix}/${id}`
  }
}
