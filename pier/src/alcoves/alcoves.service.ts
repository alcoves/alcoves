import { Alcove } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AlcovesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAlcoveInput: Alcove) {
    const alcove = await this.prismaService.alcove.create({
      data: createAlcoveInput,
    });
    return alcove;
  }

  async findAll() {
    const alcoves = await this.prismaService.alcove.findMany();
    return alcoves;
  }

  async findOne(id: string) {
    const alcove = await this.prismaService.alcove.findUnique({
      where: { id },
    });
    return alcove;
  }

  async update(id: string, updateAlcoveInput: Alcove) {
    return `This action updates a #${id} alcove`;
  }

  async remove(id: string) {
    return `This action removes a #${id} alcove`;
  }
}
