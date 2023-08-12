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
    const filepath = `/data/${video.id}.${ext}`
    await fs.rename(file.path, filepath)
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
    await this.prisma.videos.delete({
      where: { id },
    })
  }
}
