import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { AlcovesService } from './alcoves.service';
import { CheckAbilities } from '../ability/abilities.decorator';
import { Alcove } from '@prisma/client';

@Controller('alcoves')
export class AlcovesController {
  constructor(private readonly alcovesService: AlcovesService) {}

  @Post()
  @CheckAbilities({ action: 'create', subject: 'alcoves' })
  create(@Body() createAlcoveInput: Alcove) {
    return this.alcovesService.create(createAlcoveInput);
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
    return { alcove };
  }

  @Patch(':id')
  @CheckAbilities({ action: 'update', subject: 'alcoves' })
  update(@Param('id') id: string, @Body() updateAlcoveInput: Alcove) {
    return this.alcovesService.update(id, updateAlcoveInput);
  }

  @Delete(':id')
  @CheckAbilities({ action: 'delete', subject: 'alcoves' })
  remove(@Param('id') id: string) {
    return this.alcovesService.remove(id);
  }
}
