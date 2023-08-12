import { Prisma } from '@prisma/client'
import { TagsService } from './tags.service'
import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common'

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async create(@Body() data: Prisma.TagCreateInput) {
    const tag = await this.tagsService.create(data)
    return { tag }
  }

  @Get()
  async findAll() {
    const tags = await this.tagsService.findAll()
    return { tags }
  }

  @Get(':id')
  async fineOne(@Param('id') id: string) {
    const tag = await this.tagsService.findOne(id)
    return { tag }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: Prisma.TagUpdateInput) {
    const tag = await this.tagsService.update(id, data)
    return { tag }
  }
}
