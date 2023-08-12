import { Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class VideosService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.VideosCreateInput) {
    const video = await this.prisma.videos.create({
      data,
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
    await this.prisma.videos.delete({
      where: { id },
    })
  }
}
