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
import { CreateAlcoveDto } from './dto/create-alcove.dto';
import { UpdateAlcoveDto } from './dto/update-alcove.dto';
import { CheckAbilities } from '../ability/abilities.decorator';

@Controller('alcoves')
export class AlcovesController {
  constructor(private readonly alcovesService: AlcovesService) {}

  @Post()
  @CheckAbilities({ action: 'create', subject: 'alcoves' })
  create(@Body() createAlcoveDto: CreateAlcoveDto) {
    return this.alcovesService.create(createAlcoveDto);
  }

  @Get()
  @CheckAbilities({ action: 'read', subject: 'alcoves' })
  findAll() {
    return this.alcovesService.findAll();
  }

  @Get(':id')
  @CheckAbilities({ action: 'read', subject: 'alcoves' })
  findOne(@Param('id') id: string) {
    return this.alcovesService.findOne(+id);
  }

  @Patch(':id')
  @CheckAbilities({ action: 'update', subject: 'alcoves' })
  update(@Param('id') id: string, @Body() updateAlcoveDto: UpdateAlcoveDto) {
    return this.alcovesService.update(+id, updateAlcoveDto);
  }

  @Delete(':id')
  @CheckAbilities({ action: 'delete', subject: 'alcoves' })
  remove(@Param('id') id: string) {
    return this.alcovesService.remove(+id);
  }
}
