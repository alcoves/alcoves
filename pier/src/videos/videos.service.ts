import * as path from 'path'
import * as fs from 'fs-extra'
import readdirp from 'readdirp'

import { Queue } from 'bullmq'
import { JOB_QUEUES } from '../types'
import { Injectable } from '@nestjs/common'
import { Request, Response } from 'express'
import { InjectQueue } from '@nestjs/bullmq'
import { Prisma, Video } from '@prisma/client'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class VideosService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    @InjectQueue(JOB_QUEUES.SCANNER) private scannerQueue: Queue
  ) {}

  async create(data: Prisma.VideoCreateInput): Promise<Video> {
    const videoRootPath = this.config.get<string>('paths.videos')
    const normalizedLocation = path.normalize(
      `${videoRootPath}/${data.location}`
    )
    const stat = await fs.stat(normalizedLocation)
    const size = stat.size / (1024 * 1024)

    if (await !fs.exists(normalizedLocation)) {
      throw new Error(`file doesn't exist: ${normalizedLocation}`)
    }

    const video = await this.prisma.video.create({
      data: {
        title: data.title,
        playbacks: {
          create: [
            {
              size,
              location: normalizedLocation,
            },
          ],
        },
      },
    })
    return video
  }

  async findAll(query): Promise<Video[]> {
    const videos = await this.prisma.video.findMany(query)
    return videos
  }

  async findOne(id: string): Promise<Video> {
    const video = await this.prisma.video.findFirst({
      where: { id },
      include: {
        tags: true,
        playbacks: true,
        thumbnails: true,
      },
    })
    return video
  }

  async rescan(): Promise<string> {
    const videoRootPath = this.config.get<string>('paths.videos')
    for await (const entry of readdirp(videoRootPath)) {
      this.scannerQueue.add('scanner', { path: entry.fullPath })
    }
    return `rescanning ${videoRootPath}`
  }

  async getThumbnail(
    id: string,
    thumbnailId: string,
    req: Request,
    res: Response
  ): Promise<unknown> {
    const video = await this.prisma.video.findFirst({
      where: { id },
      include: {
        thumbnails: true,
      },
    })

    const thumbnail = video.thumbnails.find((p) => p.id === thumbnailId)
    const stat = fs.statSync(thumbnail.location)
    const fileSize = stat.size

    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'image/jpeg',
    }
    res.writeHead(200, head)
    return fs.createReadStream(thumbnail.location).pipe(res)
  }

  async playbackOne(
    id: string,
    playbackId: string,
    req: Request,
    res: Response
  ): Promise<unknown> {
    const video = await this.prisma.video.findFirst({
      where: { id, playbacks: { some: { id: playbackId } } },
      include: {
        playbacks: true,
      },
    })

    const playback = video.playbacks.find((p) => p.id === playbackId)
    const stat = fs.statSync(playback.location)
    const fileSize = stat.size
    const range = req.headers.range

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunksize = end - start + 1
      const file = fs.createReadStream(playback.location, {
        start,
        end,
      })
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(206, head)
      return file.pipe(res)
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      return fs.createReadStream(playback.location).pipe(res)
    }
  }

  async update(id: string, data: Prisma.VideoUpdateInput): Promise<Video> {
    const video = await this.prisma.video.update({
      data,
      where: { id },
    })
    return video
  }

  async remove(id: string) {
    return `This action removes a #${id} video`
  }
}
