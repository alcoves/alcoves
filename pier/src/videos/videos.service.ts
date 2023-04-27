import * as fs from 'fs-extra'
import { Injectable } from '@nestjs/common'
import { Request, Response } from 'express'
import { Prisma, Video } from '@prisma/client'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class VideosService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.VideoCreateInput): Promise<Video> {
    const stat = await fs.stat(data.location)
    const video = await this.prisma.video.create({
      data: { ...data, size: stat.size },
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
      },
    })
    return video
  }

  async rescan(): Promise<string> {
    const videos = await this.prisma.video.findMany()
    for (const video of videos) {
      const stat = await fs.stat(video.location)
      await this.prisma.video.update({
        where: { id: video.id },
        data: { size: stat.size },
      })
    }
    return `${videos.length} video rescanned`
  }

  async streamOne(id: string, req: Request, res: Response): Promise<unknown> {
    const video = await this.prisma.video.findFirst({
      where: { id },
    })

    const stat = fs.statSync(video.location)
    const fileSize = stat.size
    const range = req.headers.range

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunksize = end - start + 1
      const file = fs.createReadStream(video.location, {
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
      return fs.createReadStream(video.location).pipe(res)
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
