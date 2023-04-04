import { Alcove } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../svc/prisma.service';

@Injectable()
export class AlcovesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAlcoveInput: Alcove): Promise<Alcove> {
    const alcove = await this.prismaService.alcove.create({
      data: createAlcoveInput,
    });
    return alcove;
  }

  async findAll(): Promise<Alcove[]> {
    const alcoves = await this.prismaService.alcove.findMany();
    return alcoves;
  }

  async findOne(id: string): Promise<Alcove> {
    const alcove = await this.prismaService.alcove.findUnique({
      where: { id },
    });
    return alcove;
  }

  async update(id: string, updateAlcoveInput: Alcove): Promise<Alcove> {
    const alcove = await this.prismaService.alcove.update({
      where: { id },
      data: updateAlcoveInput,
    });
    return alcove;
  }

  async remove(id: string): Promise<'OK'> {
    await this.prismaService.alcove.delete({
      where: { id },
    });
    return 'OK';
  }
}
