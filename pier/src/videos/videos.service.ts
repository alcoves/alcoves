import * as path from 'path'
import * as fs from 'fs-extra'
import * as crypto from 'crypto'
import { Injectable } from '@nestjs/common'
import { Request, Response } from 'express'
import { Prisma, Video } from '@prisma/client'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class VideosService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  hashFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const md5sum = crypto.createHash('md5')
      const stream = fs.createReadStream(filePath)

      stream.on('error', (error) => {
        reject(error)
      })

      md5sum.once('readable', () => {
        const hash = md5sum.read().toString('hex')
        resolve(hash)
      })

      stream.pipe(md5sum)
    })
  }

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
              hash: await this.hashFile(normalizedLocation),
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
    const videos = await this.prisma.video.findMany()
    for (const video of videos) {
      const stat = await fs.stat(video.location)
      const size = stat.size / (1024 * 1024)
      await this.prisma.video.update({
        where: { id: video.id },
        data: { size },
      })
    }
    return `${videos.length} video rescanned`
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
