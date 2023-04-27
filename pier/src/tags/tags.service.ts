import { Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.TagCreateInput) {
    const tag = await this.prisma.tag.create({ data })
    return tag
  }

  async findAll() {
    const tags = await this.prisma.tag.findMany()
    return tags
  }

  async findOne(id: string) {
    const tag = await this.prisma.tag.findFirst({ where: { id } })
    return tag
  }

  async update(id: string, data: Prisma.TagUpdateInput) {
    const tag = await this.prisma.tag.update({ where: { id }, data })
    return tag
  }
}
