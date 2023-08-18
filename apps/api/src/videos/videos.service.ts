import fs from 'fs/promises'

import { Response } from 'express'
import { getExtension } from 'mime'
import { createReadStream } from 'fs'
import { Prisma } from '@prisma/client'
import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class VideosService {
  constructor(private prisma: PrismaService) {}

  async create(file: Express.Multer.File) {
    console.log(file)
    const ext = getExtension(file.mimetype)
    const video = await this.prisma.videos.create({
      data: {},
    })
    const newFilename = `${video.id}.${ext}`
    const filepath = file.path.replace(file.filename, newFilename)
    await fs.rename(file.path, filepath)

    // Get the input url
    // Create the video
    // Enqueue a job to ingest the video (which gets metadata)
    // Enqueue a job to create video thumbnail
    // Enqueue a job to process the video

    await this.prisma.videos.update({
      where: { id: video.id },
      data: {
        filepath,
      },
    })

    return video
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
