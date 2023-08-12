import fs from 'fs/promises'
import * as mime from 'mime'
import { Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class VideosService {
  constructor(private prisma: PrismaService) {}

  async create(file: Express.Multer.File) {
    console.log(file)
    const ext = mime.getExtension(file.mimetype)
    const video = await this.prisma.videos.create({
      data: {},
    })
    const newFilename = `${video.id}.${ext}`
    const filepath = file.path.replace(file.filename, newFilename)
    await fs.rename(file.path, filepath)

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
    const video = await this.prisma.videos.findUnique({
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
    const video = await this.prisma.videos.findUnique({
      where: { id },
    })

    await fs.unlink(video.filepath).catch((e) => {
      console.error('failed to delete video file')
    })

    await this.prisma.videos.delete({
      where: { id },
    })
  }
}
