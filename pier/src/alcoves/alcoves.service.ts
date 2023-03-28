import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAlcoveDto } from './dto/create-alcove.dto';
import { UpdateAlcoveDto } from './dto/update-alcove.dto';

@Injectable()
export class AlcovesService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createAlcoveDto: CreateAlcoveDto) {
    return 'This action adds a new alcove';
  }

  findAll() {
    return `This action returns all alcoves`;
  }

  findOne(id: number) {
    return `This action returns a #${id} alcove`;
  }

  update(id: number, updateAlcoveDto: UpdateAlcoveDto) {
    return `This action updates a #${id} alcove`;
  }

  remove(id: number) {
    return `This action removes a #${id} alcove`;
  }
}
