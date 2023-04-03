import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
  NotFoundException,
} from '@nestjs/common';
import { AlcovesService } from './alcoves.service';
import { CheckAbilities } from '../ability/abilities.decorator';
import { Alcove } from '@prisma/client';

@Controller('alcoves')
export class AlcovesController {
  constructor(private readonly alcovesService: AlcovesService) {}

  @Post()
  @CheckAbilities({ action: 'create', subject: 'alcoves' })
  async create(@Body() createAlcoveInput: Alcove) {
    const alcove = await this.alcovesService.create(createAlcoveInput);
    return { alcove };
  }

  @Get()
  @CheckAbilities({ action: 'read', subject: 'alcoves' })
  async findAll() {
    const alcoves = await this.alcovesService.findAll();
    return { alcoves };
  }

  @Get(':id')
  @CheckAbilities({ action: 'read', subject: 'alcoves' })
  async findOne(@Param('id') id: string) {
    const alcove = await this.alcovesService.findOne(id);
    if (alcove) {
      return { alcove };
    }
    return new NotFoundException();
  }

  @Patch(':id')
  @CheckAbilities({ action: 'update', subject: 'alcoves' })
  async update(@Param('id') id: string, @Body() updateAlcoveInput: Alcove) {
    const originalAlcove = await this.alcovesService.findOne(id);
    if (!originalAlcove) return new NotFoundException();

    const updatedAlcove = await this.alcovesService.update(
      id,
      updateAlcoveInput,
    );
    if (updatedAlcove) {
      return { updatedAlcove };
    }
  }

  @Delete(':id')
  @CheckAbilities({ action: 'delete', subject: 'alcoves' })
  async remove(@Param('id') id: string) {
    const originalAlcove = await this.alcovesService.findOne(id);
    if (!originalAlcove) return new NotFoundException();
    await this.alcovesService.remove(id);
    return 'OK';
  }
}
