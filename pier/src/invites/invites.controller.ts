import { InvitesService } from './invites.service';
import { Controller, Get, Post, Param } from '@nestjs/common';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post()
  create() {
    return this.invitesService.create();
  }

  @Get()
  findAll() {
    return this.invitesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invitesService.findOne(+id);
  }
}
