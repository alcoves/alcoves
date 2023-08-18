import fs from 'fs/promises'

import { Queue } from 'bull'
import { Response } from 'express'
import { getExtension } from 'mime'
import { createReadStream } from 'fs'
import { Prisma } from '@prisma/client'
import { InjectQueue } from '@nestjs/bull'
import { PrismaService } from '../services/prisma.service'
import { Injectable, StreamableFile } from '@nestjs/common'
import { Queues } from '../types/types'

@Injectable()
export class VideosService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('ingest') private ingestQueue: Queue
  ) {}

  async create(url: string) {
    // console.log(file)
    // const ext = getExtension(file.mimetype)
    const video = await this.prisma.videos.create({
      data: {
        title: 'Test',
      },
    })

    // Start ingest job
    const ingestJob = await this.ingestQueue.add('transcode', {
      video: video.id,
      url,
    })

    console.log('Created video', ingestJob.queue.name, ingestJob.id)
    const jobs = await this.ingestQueue.getJobCounts()

    // Get the failed job reasons
    const failedJobs = await this.ingestQueue.getFailed()

    failedJobs.map(async (job) => {
      console.log(job.failedReason)
      console.log(job.queue.name, job.id)
      // await job.remove()
    })

    // await this.ingestQueue.empty()
    // await this.ingestQueue.clean(0)

    // console.log(ingestJob)

    // const newFilename = `${video.id}.${ext}`
    // const filepath = file.path.replace(file.filename, newFilename)
    // await fs.rename(file.path, filepath)

    // Get the input url
    // Create the video
    // Enqueue a job to ingest the video (which gets metadata)
    // Enqueue a job to create video thumbnail
    // Enqueue a job to process the video

    // await this.prisma.videos.update({
    //   where: { id: video.id },
    //   data: {
    //     filepath,
    //   },
    // })

    return { video, jobs }
  }

  async findAll() {
    const videos = await this.prisma.videos.findMany({})
    return videos
  }

  async findOne(id: string) {
    const video = await this.prisma.videos.findUniqueOrThrow({
      where: { id },
    })
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
    const video = await this.prisma.videos.findUniqueOrThrow({
      where: { id },
    })

    await fs.unlink(video.filepath).catch((e) => {
      console.error('failed to delete video file')
    })

    await this.prisma.videos.delete({
      where: { id },
    })
  }

  async streamOne(id: string, res: Response) {
    const video = await this.prisma.videos.findUniqueOrThrow({
      where: { id },
    })

    const file = createReadStream(video.filepath)
    res.set({
      'Accept-Ranges': 'bytes',
      'Content-Type': 'video/mp4',
      'Content-Disposition': 'inline',
    })
    return new StreamableFile(file)
  }

  async watchOne(id: string) {
    const video = await this.prisma.videos.findUniqueOrThrow({
      where: { id },
    })

    const streamUrl = `http://localhost:4000/videos/${video.id}/stream`

    return {
      title: 'Test',
      posterAlt: 'test',
      videoUrl: streamUrl,
    }
  }
}
