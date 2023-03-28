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
import { AlcoveRoles, UserRoles } from '../roles/roles.decorator';
import { AlcoveRole, UserRole } from '@prisma/client';

@Controller('alcoves')
export class AlcovesController {
  constructor(private readonly alcovesService: AlcovesService) {}

  @Post()
  @UserRoles(UserRole.USER)
  create(@Body() createAlcoveDto: CreateAlcoveDto) {
    return this.alcovesService.create(createAlcoveDto);
  }

  @Get()
  @UserRoles(UserRole.USER)
  findAll() {
    return this.alcovesService.findAll();
  }

  @Get(':id')
  @AlcoveRoles(AlcoveRole.USER)
  findOne(@Param('id') id: string) {
    return this.alcovesService.findOne(+id);
  }

  @Patch(':id')
  @AlcoveRoles(AlcoveRole.ADMIN)
  update(@Param('id') id: string, @Body() updateAlcoveDto: UpdateAlcoveDto) {
    return this.alcovesService.update(+id, updateAlcoveDto);
  }

  @Delete(':id')
  @AlcoveRoles(AlcoveRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.alcovesService.remove(+id);
  }
}
